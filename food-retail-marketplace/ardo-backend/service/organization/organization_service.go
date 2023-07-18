package organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type OrganizationService interface {
	GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, int64, error)
	GetById(ctx context.Context, id string) (*organization.Organization, error)
	Create(ctx context.Context, logo, name, currency, phone, email, address string, desc *core.MlString) error
	UpdateOrgInfo(ctx context.Context, id, name, currency, phone, email, address string, desc *core.MlString) error
	UpdateOrgLogo(ctx context.Context, id, logo string) error
	Delete(ctx context.Context, id string) error
}

type organizationService struct {
	organizationRepo repo.Organization
	logger           logger.Logger
}

func NewOrganizationService(repo repo.Organization, l logger.Logger) OrganizationService {
	return &organizationService{organizationRepo: repo, logger: l}
}

func (o *organizationService) GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return o.organizationRepo.FindByFilters(ctx, offset, limit, isDeleted)
}

func (o *organizationService) GetById(ctx context.Context, id string) (*organization.Organization, error) {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return nil, err
	}
	return o.organizationRepo.FindOneById(ctx, convertedId)
}

func (o *organizationService) Create(ctx context.Context, logo, name, currency, phone, email, address string, desc *core.MlString) error {
	org, err := organization.NewOrganization(logo, name, currency, phone, email, address, desc)
	if err != nil {
		return err
	}
	return o.organizationRepo.Create(ctx, org)
}

func (o *organizationService) UpdateOrgInfo(ctx context.Context, id, name, currency, phone, email, address string, desc *core.MlString) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}

	org, err := o.organizationRepo.FindOneById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err = org.UpdateOrgInfo(name, currency, phone, email, address, desc); err != nil {
		return err
	}
	return o.organizationRepo.UpdateOrgInfo(ctx, org.GetId(), org.GetName(), org.GetLogo(), org.GetDesc(), org.GetContacts(), org.GetCurrency())
}

func (o *organizationService) UpdateOrgLogo(ctx context.Context, id, logo string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}

	org, err := o.organizationRepo.FindOneById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err = org.UpdateOrgLogo(logo); err != nil {
		return err
	}
	return o.organizationRepo.UpdateOrgLogo(ctx, org.GetId(), org.GetLogo())
}

func (o *organizationService) Delete(ctx context.Context, id string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	return o.organizationRepo.Delete(ctx, convertedId)
}
