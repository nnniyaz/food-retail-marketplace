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
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

const maxNumberOfCatalogs = 1

type CatalogService interface {
	GetAll(ctx context.Context) ([]*catalog.Catalog, int64, error)
	GetOneById(ctx context.Context, catalogId string) (*catalog.Catalog, error)
	Create(ctx context.Context, catalog *catalog.Catalog) error
	Update(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection) error
	Publish(ctx context.Context, catalog *catalog.Catalog) error
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

func (c *catalogService) Update(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection) error {
	foundCatalog, err := c.GetOneById(ctx, catalogId)
	if err != nil {
		return err
	}
	foundCatalog.SaveStructureOrder(structure)
	return c.catalogRepo.UpdateCatalog(ctx, foundCatalog)
}

func (c *catalogService) Publish(ctx context.Context, catalog *catalog.Catalog) error {
	sections := make(map[string]*section.Section)
	categories := make(map[string]*category.Category)
	products := make(map[string]*product.Product)
	for _, catalogsSection := range catalog.GetStructure() {
		sections[catalogsSection.GetId().String()] = nil
		for _, catalogsCategory := range catalogsSection.GetCategories() {
			categories[catalogsCategory.GetId().String()] = nil
			for _, catalogsProduct := range catalogsCategory.GetProducts() {
				products[catalogsProduct.GetId().String()] = nil
			}
		}
	}
	for key, _ := range sections {
		convertedId, err := uuid.UUIDFromString(key)
		if err != nil {
			return err
		}
		foundSection, err := c.sectionRepo.FindOneById(ctx, convertedId)
		if err != nil {
			return err
		}
		sections[key] = foundSection
	}
	for key, _ := range categories {
		convertedId, err := uuid.UUIDFromString(key)
		if err != nil {
			return err
		}
		foundCategory, err := c.categoryRepo.FindOneById(ctx, convertedId)
		if err != nil {
			return err
		}
		categories[key] = foundCategory
	}
	for key, _ := range products {
		convertedId, err := uuid.UUIDFromString(key)
		if err != nil {
			return err
		}
		foundProduct, err := c.productRepo.FindOneById(ctx, convertedId)
		if err != nil {
			return err
		}
		products[key] = foundProduct
	}
	catalog.Publish()
	return c.catalogRepo.PublishCatalog(ctx, catalog, sections, categories, products)
}
