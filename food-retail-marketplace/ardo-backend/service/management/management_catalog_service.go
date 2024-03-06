package management

import (
	"context"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/pkg/logger"
	catalogService "github/nnniyaz/ardo/service/catalog"
	categoryService "github/nnniyaz/ardo/service/category"
	productService "github/nnniyaz/ardo/service/product"
	sectionService "github/nnniyaz/ardo/service/section"
	slideService "github/nnniyaz/ardo/service/slide"
)

type ManagementCatalogService interface {
	GetAllCatalogs(ctx context.Context) ([]*catalog.Catalog, int64, error)
	GetCatalogById(ctx context.Context, catalogId string) (*catalog.Catalog, error)
	CreateCatalog(ctx context.Context) error
	UpdateCatalog(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection) error
	PublishCatalog(ctx context.Context, catalogId string) error
}

type managementCatalogService struct {
	logger          logger.Logger
	catalogService  catalogService.CatalogService
	sectionService  sectionService.SectionService
	categoryService categoryService.CategoryService
	productService  productService.ProductService
	slideService    slideService.SlideService
}

func NewManagementCatalogService(l logger.Logger, catalogService catalogService.CatalogService, sectionService sectionService.SectionService, categoryService categoryService.CategoryService, productService productService.ProductService, slideService slideService.SlideService) ManagementCatalogService {
	return &managementCatalogService{logger: l, catalogService: catalogService, sectionService: sectionService, categoryService: categoryService, productService: productService, slideService: slideService}
}

func (m *managementCatalogService) GetAllCatalogs(ctx context.Context) ([]*catalog.Catalog, int64, error) {
	return m.catalogService.GetAll(ctx)
}

func (m *managementCatalogService) GetCatalogById(ctx context.Context, catalogId string) (*catalog.Catalog, error) {
	return m.catalogService.GetOneById(ctx, catalogId)
}

func (m *managementCatalogService) CreateCatalog(ctx context.Context) error {
	return m.catalogService.Create(ctx, catalog.NewCatalog())
}

func (m *managementCatalogService) UpdateCatalog(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection) error {
	return m.catalogService.Update(ctx, catalogId, structure)
}

func (m *managementCatalogService) PublishCatalog(ctx context.Context, catalogId string) error {
	foundCatalog, err := m.catalogService.GetOneById(ctx, catalogId)
	if err != nil {
		return err
	}

	selectedSections := make(map[string]*section.Section)
	selectedCategories := make(map[string]*category.Category)
	selectedProducts := make(map[string]*product.Product)
	for _, catalogSection := range foundCatalog.GetStructure() {
		foundSection, err := m.sectionService.GetOneById(ctx, catalogSection.GetId().String())
		if err != nil {
			return err
		}
		selectedSections[catalogSection.GetId().String()] = foundSection

		for _, catalogCategory := range catalogSection.GetCategories() {
			foundCategory, err := m.categoryService.GetOneById(ctx, catalogCategory.GetId().String())
			if err != nil {
				return err
			}
			selectedCategories[catalogCategory.GetId().String()] = foundCategory

			for _, catalogProduct := range catalogCategory.GetProducts() {
				foundProduct, err := m.productService.GetOneById(ctx, catalogProduct.GetId().String())
				if err != nil {
					return err
				}
				selectedProducts[catalogProduct.GetId().String()] = foundProduct
			}
		}
	}

	slides, _, err := m.slideService.GetAllByFilters(ctx, 0, 0, false)
	if err != nil {
		return err
	}
	return m.catalogService.Publish(ctx, foundCatalog, selectedSections, selectedCategories, selectedProducts, slides)
}
