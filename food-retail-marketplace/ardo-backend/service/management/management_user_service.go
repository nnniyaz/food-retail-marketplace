package management

import (
	"context"
	"errors"
	"fmt"
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/user"
	exceptionsUser "github/nnniyaz/ardo/domain/user/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	linkService "github/nnniyaz/ardo/service/link"
	userService "github/nnniyaz/ardo/service/user"
)

var (
	ErrEmailAlreadyExists = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_ALREADY_EXISTS)
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
	logger       logger.Logger
	config       *config.Config
	emailService email.Email
	userService  userService.UserService
	linkService  linkService.ActivationLinkService
}

func NewManagementUserService(l logger.Logger, config *config.Config, emailService email.Email, userService userService.UserService, linkService linkService.ActivationLinkService) ManagementUserService {
	return &managementUserService{logger: l, config: config, emailService: emailService, userService: userService, linkService: linkService}
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
	if u, err := m.userService.GetByEmail(ctx, email); err != nil && !errors.Is(err, exceptionsUser.ErrUserNotFound) || u != nil {
		if err != nil && !errors.Is(exceptionsUser.ErrUserNotFound, err) {
			return err
		}

		foundActivationLink, err := m.linkService.GetByUserId(ctx, u.GetId().String())
		if err != nil {
			return err
		}
		if foundActivationLink != nil && !u.GetIsDeleted() {
			if foundActivationLink.GetIsActivated() {
				return ErrEmailAlreadyExists
			}

			if !u.ComparePassword(password) {
				err = m.userService.UpdatePassword(ctx, u, password)
				if err != nil {
					return err
				}
			}
			foundActivationLink.UpdateLinkId()
			err = m.linkService.UpdateLink(ctx, foundActivationLink)

			link := m.config.GetApiUri() + "/auth/confirm/" + foundActivationLink.GetLinkId().String()

			subject := "Confirm your email"
			htmlBody := fmt.Sprintf("<p>Hi %s,</p><p>Thanks for signing up for Ardo! We're excited to have you as an early user.</p><p>Click the link below to confirm your email address:</p><p><a href=\"%s\">Click here!</a></p><p>Thanks,<br/>The Ardo Team</p>", u.GetFirstName(), link)
			return m.emailService.SendMail([]string{email}, subject, htmlBody)
		}
	}

	newUser, err := user.NewUser(firstName, lastName, email, phoneNumber, countryCode, password, userType, preferredLang, address, floor, apartment, deliveryComment)
	if err != nil {
		return err
	}
	if err = m.userService.Create(ctx, newUser); err != nil {
		return err
	}

	newActivationLink := activationLink.NewActivationLink(newUser.GetId())
	err = m.linkService.Create(ctx, newActivationLink)
	if err != nil {
		return err
	}

	link := m.config.GetApiUri() + "/auth/confirm/" + newActivationLink.GetLinkId().String()
	subject := "Confirm your email"
	htmlBody := fmt.Sprintf("<p>Hi %s,</p><p>Thanks for signing up for Ardo! We're excited to have you as an early user.</p><p>Click the link below to confirm your email address:</p><p><a href=\"%s\">Click here!</a></p><p>Thanks,<br/>The Ardo Team</p>", newUser.GetFirstName(), link)
	return m.emailService.SendMail([]string{newUser.GetEmail().String()}, subject, htmlBody)
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
