package organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/repo"
)

type OrgService interface {
	GetAll(ctx context.Context) ([]*organization.Organization, error)
	GetByOrgId(ctx context.Context, orgId string) (*organization.Organization, error)
	Create(ctx context.Context, userId string, role string) error
	UpdateMerchantRole(ctx context.Context, orgId, role string) error
	Delete(ctx context.Context, orgId string) error
}

type orgService struct {
	orgRepo repo.Organization
}

func NewOrgService(orgRepo repo.Organization) OrgService {
	return &orgService{orgRepo: orgRepo}
}

func (s *orgService) GetAll(ctx context.Context) ([]*organization.Organization, error) {
	orgs, err := s.orgRepo.Find(ctx)
	if err != nil {
		return nil, err
	}
	return orgs, nil
}

func (s *orgService) GetByOrgId(ctx context.Context, orgId string) (*organization.Organization, error) {
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return nil, err
	}
	org, err := s.orgRepo.FindOneByOrgId(ctx, convertedOrgId)
	if err != nil {
		return nil, err
	}
	return org, nil
}

func (s *orgService) Create(ctx context.Context, userId, role string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	org, err := organization.NewOrganization(convertedUserId, role)
	if err != nil {
		return err
	}
	return s.orgRepo.Create(ctx, org)
}

func (s *orgService) UpdateMerchantRole(ctx context.Context, userId, role string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	convertedRole, err := valueobject.NewMerchantRole(role)
	if err != nil {
		return err
	}
	return s.orgRepo.UpdateMerchantRole(ctx, convertedUserId, convertedRole)
}

func (s *orgService) Delete(ctx context.Context, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	return s.orgRepo.Delete(ctx, convertedUserId)
}
