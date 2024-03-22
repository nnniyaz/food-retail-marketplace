package management

import (
	"context"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/logger"
	userService "github/nnniyaz/ardo/service/user"
)

type ManagementUserService interface {
	GetUsersByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error)
	GetUserById(ctx context.Context, userId string) (*user.User, error)
	AddUser(ctx context.Context, firstName, lastName, email, phoneNumber, password, userType, preferredLang, address, floor, apartment, deliveryComment string) error
	RecoverUser(ctx context.Context, userId string) error
	DeleteUser(ctx context.Context, userId string) error
	UpdateUserCredentials(ctx context.Context, userId, firstName, lastName string) error
	UpdateUserEmail(ctx context.Context, userId, email string) error
	UpdateUserPreferredLang(ctx context.Context, userId, preferredLang string) error
	UpdateUserPassword(ctx context.Context, userId, password string) error
}

type managementUserService struct {
	logger      logger.Logger
	userService userService.UserService
}

func NewManagementUserService(l logger.Logger, userService userService.UserService) ManagementUserService {
	return &managementUserService{userService: userService, logger: l}
}

func (m *managementUserService) GetUsersByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error) {
	users, count, err := m.userService.GetByFilters(ctx, offset, limit, isDeleted)
	if err != nil {
		return nil, 0, err
	}
	return users, count, nil
}

func (m *managementUserService) GetUserById(ctx context.Context, userId string) (*user.User, error) {
	return m.userService.GetById(ctx, userId)
}

func (m *managementUserService) AddUser(ctx context.Context, firstName, lastName, email, phoneNumber, password, userType, preferredLang, address, floor, apartment, deliveryComment string) error {
	newUser, err := user.NewUser(firstName, lastName, email, phoneNumber, password, userType, preferredLang, address, floor, apartment, deliveryComment)
	if err != nil {
		return err
	}
	return m.userService.Create(ctx, newUser)
}

func (m *managementUserService) UpdateUserCredentials(ctx context.Context, userId, firstName, lastName string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdateCredentials(ctx, foundUser, firstName, lastName)
}

func (m *managementUserService) UpdateUserEmail(ctx context.Context, userId, email string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdateEmail(ctx, foundUser, email)
}

func (m *managementUserService) UpdateUserPreferredLang(ctx context.Context, userId, preferredLang string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdatePreferredLang(ctx, foundUser, preferredLang)
}

func (m *managementUserService) UpdateUserPassword(ctx context.Context, userId, password string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdatePassword(ctx, foundUser, password)
}

func (m *managementUserService) RecoverUser(ctx context.Context, userId string) error {
	return m.userService.Recover(ctx, userId)
}

func (m *managementUserService) DeleteUser(ctx context.Context, userId string) error {
	return m.userService.Delete(ctx, userId)
}
