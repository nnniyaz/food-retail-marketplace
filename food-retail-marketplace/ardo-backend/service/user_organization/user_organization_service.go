package user_organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

var (
	ErrUserAlreadyInOrg = core.NewI18NError(core.EINVALID, core.TXT_USER_ALREADY_IN_ORG)
)

type UserOrgService interface {
	GetAll(ctx context.Context) ([]*user_organization.UserOrganization, error)
	GetUsersByOrgId(ctx context.Context, orgId string, offset, limit int64, isDeleted bool) ([]*user_organization.UserOrganization, int64, error)
	Create(ctx context.Context, orgId, userId string, role string) error
	UpdateMerchantRole(ctx context.Context, orgId, userId, role string) error
	DeleteOrg(ctx context.Context, orgId string) error
	DeleteUserFromAllOrgs(ctx context.Context, userId string) error
	DeleteUserFromOrg(ctx context.Context, orgId, userId string) error
}

type userOrgService struct {
	orgRepo repo.UserOrganization
	logger  logger.Logger
}

func NewUserOrgService(orgRepo repo.UserOrganization, l logger.Logger) UserOrgService {
	return &userOrgService{orgRepo: orgRepo, logger: l}
}

func (s *userOrgService) GetAll(ctx context.Context) ([]*user_organization.UserOrganization, error) {
	uo, err := s.orgRepo.Find(ctx)
	if err != nil {
		return nil, err
	}
	return uo, nil
}

func (s *userOrgService) GetUsersByOrgId(ctx context.Context, orgId string, offset, limit int64, isDeleted bool) ([]*user_organization.UserOrganization, int64, error) {
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return nil, 0, err
	}
	usersOrg, count, err := s.orgRepo.FindUsersByOrgId(ctx, convertedOrgId, offset, limit, isDeleted)
	if err != nil {
		return nil, 0, err
	}
	return usersOrg, count, nil
}

func (s *userOrgService) Create(ctx context.Context, orgId, userId, role string) error {
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return err
	}
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	foundUserOrg, err := s.orgRepo.FindOneByUserIdAndOrgId(ctx, convertedOrgId, convertedUserId, false)
	if err != nil {
		return err
	}
	if foundUserOrg != nil {
		return ErrUserAlreadyInOrg
	}
	userOrg, err := user_organization.NewUserOrganization(convertedOrgId, convertedUserId, role)
	if err != nil {
		return err
	}
	return s.orgRepo.Create(ctx, userOrg)
}

func (s *userOrgService) UpdateMerchantRole(ctx context.Context, orgId, userId, role string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return err
	}
	convertedRole, err := valueobject.NewMerchantRole(role)
	if err != nil {
		return err
	}
	return s.orgRepo.UpdateMerchantRole(ctx, convertedOrgId, convertedUserId, convertedRole)
}

func (s *userOrgService) DeleteOrg(ctx context.Context, orgId string) error {
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return err
	}
	return s.orgRepo.DeleteOrg(ctx, convertedOrgId)
}

func (s *userOrgService) DeleteUserFromAllOrgs(ctx context.Context, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	return s.orgRepo.DeleteUserFromAllOrgs(ctx, convertedUserId)
}

func (s *userOrgService) DeleteUserFromOrg(ctx context.Context, orgId, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	convertedOrgId, err := uuid.UUIDFromString(orgId)
	if err != nil {
		return err
	}
	return s.orgRepo.DeleteUserFromOrg(ctx, convertedOrgId, convertedUserId)
}
