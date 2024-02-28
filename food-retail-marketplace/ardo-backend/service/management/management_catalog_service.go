package management

import (
	"context"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/pkg/logger"
	catalogService "github/nnniyaz/ardo/service/catalog"
)

type ManagementCatalogService interface {
	GetAllCatalogs(ctx context.Context) ([]*catalog.Catalog, int64, error)
	GetCatalogById(ctx context.Context, catalogId string) (*catalog.Catalog, error)
	CreateCatalog(ctx context.Context) error
	UpdateCatalog(ctx context.Context, catalogId string, structure []valueObject.CatalogsSection) error
	PublishCatalog(ctx context.Context, catalogId string) error
}

type managementCatalogService struct {
	logger         logger.Logger
	catalogService catalogService.CatalogService
}

func NewManagementCatalogService(l logger.Logger, catalogService catalogService.CatalogService) ManagementCatalogService {
	return &managementCatalogService{logger: l, catalogService: catalogService}
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
	return m.catalogService.Publish(ctx, foundCatalog)
}
