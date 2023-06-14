package management

import (
	"context"
	"github/nnniyaz/ardo/domain/user"
	userService "github/nnniyaz/ardo/service/user"
)

type ManagementService interface {
	GetAllUsers(ctx context.Context) ([]*user.User, error)
	GetUsersByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, error)
	GetUserById(ctx context.Context, userId string) (*user.User, error)
	AddUser(ctx context.Context, firstName, lastName, email, password, userType string) error
	DeleteUser(ctx context.Context, userId string) error
	UpdateUserCredentials(ctx context.Context, userId, firstName, lastName, email string) error
	UpdateUserPassword(ctx context.Context, userId, password string) error
}

type managementService struct {
	userService userService.UserService
}

func NewManagementService(userService userService.UserService) ManagementService {
	return &managementService{userService: userService}
}

func (m *managementService) GetAllUsers(ctx context.Context) ([]*user.User, error) {
	users, err := m.userService.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (m *managementService) GetUsersByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, error) {
	users, err := m.userService.GetByFilters(ctx, offset, limit, isDeleted)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (m *managementService) GetUserById(ctx context.Context, userId string) (*user.User, error) {
	u, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return nil, err
	}
	return u, nil
}

func (m *managementService) AddUser(ctx context.Context, firstName, lastName, email, password, userType string) error {
	_, err := m.userService.Create(ctx, firstName, lastName, email, password, userType)
	return err
}

func (m *managementService) DeleteUser(ctx context.Context, userId string) error {
	return m.userService.Delete(ctx, userId)
}

func (m *managementService) UpdateUserCredentials(ctx context.Context, userId, firstName, lastName, email string) error {
	return m.userService.UpdateCredentials(ctx, userId, firstName, lastName, email)
}

func (m *managementService) UpdateUserPassword(ctx context.Context, userId, password string) error {
	return m.userService.UpdatePassword(ctx, userId, password)
}
