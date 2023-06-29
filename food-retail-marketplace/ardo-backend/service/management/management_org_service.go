package management

import (
	"context"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	orgService "github/nnniyaz/ardo/service/organization"
)

type ManagementOrgService interface {
	GetOrgsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, error)
	GetOrgById(ctx context.Context, orgId string) (*organization.Organization, error)
	AddOrg(ctx context.Context, logo, name, currency, phone, email, address string, desc *core.MlString) error
	UpdateOrgInfo(ctx context.Context, id, name, currency, phone, email, address string, desc *core.MlString) error
	UpdateOrgLogo(ctx context.Context, id, logo string) error
	DeleteOrg(ctx context.Context, orgId string) error
}

type managementOrgService struct {
	orgService orgService.OrganizationService
	logger     logger.Logger
}

func NewManagementOrgService(organizationService orgService.OrganizationService, l logger.Logger) ManagementOrgService {
	return &managementOrgService{orgService: organizationService, logger: l}
}

func (m *managementOrgService) GetOrgsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, error) {
	return m.orgService.GetByFilters(ctx, offset, limit, isDeleted)
}

func (m *managementOrgService) GetOrgById(ctx context.Context, orgId string) (*organization.Organization, error) {
	return m.orgService.GetById(ctx, orgId)
}

func (m *managementOrgService) AddOrg(ctx context.Context, logo, name, currency, phone, email, address string, desc *core.MlString) error {
	return m.orgService.Create(ctx, logo, name, currency, phone, email, address, desc)
}

func (m *managementOrgService) UpdateOrgInfo(ctx context.Context, id, name, currency, phone, email, address string, desc *core.MlString) error {
	return m.orgService.UpdateOrgInfo(ctx, id, name, currency, phone, email, address, desc)
}

func (m *managementOrgService) UpdateOrgLogo(ctx context.Context, id, logo string) error {
	return m.orgService.UpdateOrgLogo(ctx, id, logo)
}

func (m *managementOrgService) DeleteOrg(ctx context.Context, orgId string) error {
	return m.orgService.Delete(ctx, orgId)
}
