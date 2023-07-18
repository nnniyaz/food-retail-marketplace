package management

import (
	"context"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	orgService "github/nnniyaz/ardo/service/organization"
	userOrgService "github/nnniyaz/ardo/service/user_organization"
)

type ManagementOrgService interface {
	GetOrgsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, int64, error)
	GetOrgById(ctx context.Context, orgId string) (*organization.Organization, error)
	AddOrg(ctx context.Context, logo, name, currency, phone, email, address string, desc *core.MlString) error
	UpdateOrgInfo(ctx context.Context, id, name, currency, phone, email, address string, desc *core.MlString) error
	UpdateOrgLogo(ctx context.Context, id, logo string) error
	DeleteOrg(ctx context.Context, orgId string) error

	GetUsersByOrgId(ctx context.Context, orgId string, offset, limit int64, isDeleted bool) ([]*user_organization.UserOrganization, int64, error)
	AddUserToOrg(ctx context.Context, orgId, userId, role string) error
	UpdateUserOrgRole(ctx context.Context, orgId, userId, role string) error
	RemoveUserFromOrg(ctx context.Context, orgId, userId string) error
}

type managementOrgService struct {
	orgService     orgService.OrganizationService
	userOrgService userOrgService.UserOrgService
	logger         logger.Logger
}

func NewManagementOrgService(organizationService orgService.OrganizationService, userOrganizationService userOrgService.UserOrgService, l logger.Logger) ManagementOrgService {
	return &managementOrgService{orgService: organizationService, userOrgService: userOrganizationService, logger: l}
}

// ---------------------------------------------------------------------------------------
// ------------------------------------ Organization -------------------------------------
// ---------------------------------------------------------------------------------------

func (m *managementOrgService) GetOrgsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, int64, error) {
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

// ---------------------------------------------------------------------------------------
// ------------------------------------ User Organization --------------------------------
// ---------------------------------------------------------------------------------------

func (m *managementOrgService) GetUsersByOrgId(ctx context.Context, orgId string, offset, limit int64, isDeleted bool) ([]*user_organization.UserOrganization, int64, error) {
	return m.userOrgService.GetUsersByOrgId(ctx, orgId, offset, limit, isDeleted)
}

func (m *managementOrgService) AddUserToOrg(ctx context.Context, orgId, userId, role string) error {
	return m.userOrgService.Create(ctx, orgId, userId, role)
}

func (m *managementOrgService) UpdateUserOrgRole(ctx context.Context, orgId, userId, role string) error {
	return m.userOrgService.UpdateMerchantRole(ctx, orgId, userId, role)
}

func (m *managementOrgService) RemoveUserFromOrg(ctx context.Context, orgId, userId string) error {
	return m.userOrgService.DeleteUserFromOrg(ctx, orgId, userId)
}
