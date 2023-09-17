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
	AddUser(ctx context.Context, firstName, lastName, email, password, userType string) error
	RecoverUser(ctx context.Context, userId string) error
	DeleteUser(ctx context.Context, userId string) error
	UpdateUserCredentials(ctx context.Context, userId, firstName, lastName, email string) error
	UpdateUserPassword(ctx context.Context, userId, password string) error
}

type managementUserService struct {
	userService userService.UserService
	logger      logger.Logger
}

func NewManagementUserService(userService userService.UserService, l logger.Logger) ManagementUserService {
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

func (m *managementUserService) AddUser(ctx context.Context, firstName, lastName, email, password, userType string) error {
	_, err := m.userService.Create(ctx, firstName, lastName, email, password, userType)
	return err
}

func (m *managementUserService) RecoverUser(ctx context.Context, userId string) error {
	return m.userService.Recover(ctx, userId)
}

func (m *managementUserService) DeleteUser(ctx context.Context, userId string) error {
	return m.userService.Delete(ctx, userId)
}

func (m *managementUserService) UpdateUserCredentials(ctx context.Context, userId, firstName, lastName, email string) error {
	return m.userService.UpdateCredentials(ctx, userId, firstName, lastName, email)
}

func (m *managementUserService) UpdateUserPassword(ctx context.Context, userId, password string) error {
	return m.userService.UpdatePassword(ctx, userId, password)
}
