package current_user

import (
	"context"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	sessionService "github/nnniyaz/ardo/service/session"
	userService "github/nnniyaz/ardo/service/user"
)

var (
	ErrOldPasswordDoesNotMatch = core.NewI18NError(core.EINVALID, core.TXT_OLD_PASSWORD_DOES_NOT_MATCH)
)

type CurrentUserService interface {
	UpdateCredentials(ctx context.Context, user *user.User, firstName, lastName string) error
	UpdateEmail(ctx context.Context, user *user.User, email string) error
	UpdatePreferredLang(ctx context.Context, user *user.User, preferredLang string) error
	ChangePassword(ctx context.Context, user *user.User, oldPassword, newPassword string) error
	AddDeliveryPoint(ctx context.Context, user *user.User, deliveryPoint deliveryInfo.DeliveryInfo) error
	UpdateDeliveryPoint(ctx context.Context, user *user.User, deliveryPointId, address, floor, apartment, deliveryComment string) error
	DeleteDeliveryPoint(ctx context.Context, user *user.User, deliveryPointId string) error
	ChangeLastDeliveryPoint(ctx context.Context, user *user.User, deliveryPointId string) error
}

type currentUserService struct {
	logger         logger.Logger
	userService    userService.UserService
	sessionService sessionService.SessionService
}

func NewCurrentUser(logger logger.Logger, userService userService.UserService, sessionService sessionService.SessionService) CurrentUserService {
	return &currentUserService{logger: logger, userService: userService, sessionService: sessionService}
}

func (s *currentUserService) UpdateCredentials(ctx context.Context, user *user.User, firstName, lastName string) error {
	return s.userService.UpdateCredentials(ctx, user, firstName, lastName)
}

func (s *currentUserService) UpdateEmail(ctx context.Context, user *user.User, email string) error {
	return s.userService.UpdateEmail(ctx, user, email)
}

func (s *currentUserService) UpdatePreferredLang(ctx context.Context, user *user.User, preferredLang string) error {
	return s.userService.UpdatePreferredLang(ctx, user, preferredLang)
}

func (s *currentUserService) ChangePassword(ctx context.Context, user *user.User, oldPassword, newPassword string) error {
	if !user.GetPassword().Compare(oldPassword) {
		return ErrOldPasswordDoesNotMatch
	}
	err := s.userService.UpdatePassword(ctx, user, newPassword)
	if err != nil {
		return err
	}
	return s.sessionService.DeleteAllSessionsByUserId(ctx, user.GetId().String())
}

func (s *currentUserService) AddDeliveryPoint(ctx context.Context, user *user.User, deliveryPoint deliveryInfo.DeliveryInfo) error {
	return s.userService.AddDeliveryPoint(ctx, user, deliveryPoint)
}

func (s *currentUserService) UpdateDeliveryPoint(ctx context.Context, user *user.User, deliveryPointId, address, floor, apartment, deliveryComment string) error {
	return s.userService.UpdateDeliveryPoint(ctx, user, deliveryPointId, address, floor, apartment, deliveryComment)
}

func (s *currentUserService) DeleteDeliveryPoint(ctx context.Context, user *user.User, deliveryPointId string) error {
	return s.userService.DeleteDeliveryPoint(ctx, user, deliveryPointId)
}

func (s *currentUserService) ChangeLastDeliveryPoint(ctx context.Context, user *user.User, deliveryPointId string) error {
	return s.userService.ChangeLastDeliveryPoint(ctx, user, deliveryPointId)
}
