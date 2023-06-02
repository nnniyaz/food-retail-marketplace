package user_organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	"github/nnniyaz/ardo/repo"
)

type UserOrgService interface {
	GetAll(ctx context.Context) ([]*user_organization.UserOrganization, error)
	GetByOrgId(ctx context.Context, orgId string) (*user_organization.UserOrganization, error)
	Create(ctx context.Context, userId string, role string) error
	UpdateMerchantRole(ctx context.Context, orgId, role string) error
	Delete(ctx context.Context, orgId string) error
}

type userOrgService struct {
	orgRepo repo.UserOrganization
}

func NewUserOrgService(orgRepo repo.UserOrganization) UserOrgService {
	return &userOrgService{orgRepo: orgRepo}
}

func (s *userOrgService) GetAll(ctx context.Context) ([]*user_organization.UserOrganization, error) {
	uo, err := s.orgRepo.Find(ctx)
	if err != nil {
		return nil, err
	}
	return uo, nil
}

func (s *userOrgService) GetByOrgId(ctx context.Context, orgId string) (*user_organization.UserOrganization, error) {
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return nil, err
	}
	userOrg, err := s.orgRepo.FindOneByOrgId(ctx, convertedOrgId)
	if err != nil {
		return nil, err
	}
	return userOrg, nil
}

func (s *userOrgService) Create(ctx context.Context, userId, role string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	userOrg, err := user_organization.NewUserOrganization(convertedUserId, role)
	if err != nil {
		return err
	}
	return s.orgRepo.Create(ctx, userOrg)
}

func (s *userOrgService) UpdateMerchantRole(ctx context.Context, userId, role string) error {
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

func (s *userOrgService) Delete(ctx context.Context, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	return s.orgRepo.Delete(ctx, convertedUserId)
}
