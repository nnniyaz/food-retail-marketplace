package management

import (
	"context"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/logger"
	userService "github/nnniyaz/ardo/service/user"
)

type ManagementUserService interface {
	GetUsersByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error)
	GetUserById(ctx context.Context, userId string) (*user.User, error)
	AddUser(ctx context.Context, firstName, lastName, email, phoneNumber, countryCode, password, userType, preferredLang, address, floor, apartment, deliveryComment string) error
	UpdateUserCredentials(ctx context.Context, userId, firstName, lastName string) error
	UpdateUserEmail(ctx context.Context, userId, email string) error
	UpdateUserPhone(ctx context.Context, userId, phoneNumber, countryCode string) error
	UpdateUserPreferredLang(ctx context.Context, userId, preferredLang string) error
	UpdateUserRole(ctx context.Context, userId, role string) error
	AddUserDeliveryPoint(ctx context.Context, userId, address, floor, apartment, deliveryComment string) error
	UpdateUserDeliveryPoint(ctx context.Context, userId, deliveryPointId, address, floor, apartment, deliveryComment string) error
	DeleteUserDeliveryPoint(ctx context.Context, userId, deliveryPointId string) error
	ChangeUserLastDeliveryPoint(ctx context.Context, userId, deliveryPointId string) error
	UpdateUserPassword(ctx context.Context, userId, password string) error
	RecoverUser(ctx context.Context, userId string) error
	DeleteUser(ctx context.Context, userId string) error
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

func (m *managementUserService) AddUser(ctx context.Context, firstName, lastName, email, phoneNumber, countryCode, password, userType, preferredLang, address, floor, apartment, deliveryComment string) error {
	newUser, err := user.NewUser(firstName, lastName, email, phoneNumber, countryCode, password, userType, preferredLang, address, floor, apartment, deliveryComment)
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

func (m *managementUserService) UpdateUserPhone(ctx context.Context, userId, phoneNumber, countryCode string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdatePhone(ctx, foundUser, phoneNumber, countryCode)
}

func (m *managementUserService) UpdateUserPreferredLang(ctx context.Context, userId, preferredLang string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdatePreferredLang(ctx, foundUser, preferredLang)
}

func (m *managementUserService) UpdateUserRole(ctx context.Context, userId, role string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdateRole(ctx, foundUser, role)
}

func (m *managementUserService) AddUserDeliveryPoint(ctx context.Context, userId, address, floor, apartment, deliveryComment string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	userNewDeliveryPoint, err := deliveryInfo.NewDeliveryInfo(address, floor, apartment, deliveryComment)
	if err != nil {
		return err
	}
	return m.userService.AddDeliveryPoint(ctx, foundUser, userNewDeliveryPoint)
}

func (m *managementUserService) UpdateUserDeliveryPoint(ctx context.Context, userId, deliveryPointId, address, floor, apartment, deliveryComment string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.UpdateDeliveryPoint(ctx, foundUser, deliveryPointId, address, floor, apartment, deliveryComment)
}

func (m *managementUserService) DeleteUserDeliveryPoint(ctx context.Context, userId, deliveryPointId string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.DeleteDeliveryPoint(ctx, foundUser, deliveryPointId)
}

func (m *managementUserService) ChangeUserLastDeliveryPoint(ctx context.Context, userId, deliveryPointId string) error {
	foundUser, err := m.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	return m.userService.ChangeLastDeliveryPoint(ctx, foundUser, deliveryPointId)
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
