package catalog

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/exceptions"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/domain/slide"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

const maxNumberOfCatalogs = 1

type CatalogService interface {
	GetAll(ctx context.Context) ([]*catalog.Catalog, int64, error)
	GetOneById(ctx context.Context, catalogId string) (*catalog.Catalog, error)
	Create(ctx context.Context, catalog *catalog.Catalog) error
	Update(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection, promo []valueObject.CatalogsSection) error
	Publish(ctx context.Context, catalog *catalog.Catalog, selectedSections map[string]*section.Section, selectedCategory map[string]*category.Category, selectedProducts map[string]*product.Product, slides []*slide.Slide) error
}

type catalogService struct {
	logger       logger.Logger
	catalogRepo  repo.Catalog
	sectionRepo  repo.Section
	categoryRepo repo.Category
	productRepo  repo.Product
}

func NewCatalogService(l logger.Logger, catalogRepo repo.Catalog, sectionRepo repo.Section, categoryRepo repo.Category, productRepo repo.Product) CatalogService {
	return &catalogService{logger: l, catalogRepo: catalogRepo, sectionRepo: sectionRepo, categoryRepo: categoryRepo, productRepo: productRepo}
}

func (c *catalogService) GetAll(ctx context.Context) ([]*catalog.Catalog, int64, error) {
	return c.catalogRepo.FindAll(ctx)
}

func (c *catalogService) GetOneById(ctx context.Context, catalogId string) (*catalog.Catalog, error) {
	convertedId, err := uuid.UUIDFromString(catalogId)
	if err != nil {
		return nil, err
	}
	return c.catalogRepo.FindOneById(ctx, convertedId)
}

func (c *catalogService) Create(ctx context.Context, catalog *catalog.Catalog) error {
	_, count, err := c.GetAll(ctx)
	if err != nil {
		return err
	}
	if count >= maxNumberOfCatalogs {
		return exceptions.ErrMaximumNumberOfCatalogs
	}
	return c.catalogRepo.CreateCatalog(ctx, catalog)
}

func (c *catalogService) Update(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection, promo []valueObject.CatalogsSection) error {
	foundCatalog, err := c.GetOneById(ctx, catalogId)
	if err != nil {
		return err
	}
	foundCatalog.UpdateCatalog(structure, promo)
	return c.catalogRepo.UpdateCatalog(ctx, foundCatalog)
}

func (c *catalogService) Publish(ctx context.Context, catalog *catalog.Catalog, selectedSections map[string]*section.Section, selectedCategories map[string]*category.Category, selectedProducts map[string]*product.Product, slides []*slide.Slide) error {
	return c.catalogRepo.PublishCatalog(ctx, catalog, selectedSections, selectedCategories, selectedProducts, slides)
}
