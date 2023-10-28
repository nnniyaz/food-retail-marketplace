package current_user

import (
	"context"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	sessionService "github/nnniyaz/ardo/service/session"
	userService "github/nnniyaz/ardo/service/user"
)

var (
	ErrOldPasswordDoesNotMatch = core.NewI18NError(core.EINVALID, core.TXT_OLD_PASSWORD_DOES_NOT_MATCH)
)

type CurrentUserService interface {
	UpdateCredentials(ctx context.Context, userId, firstName, lastName, email, preferredLang string) error
	ChangePassword(ctx context.Context, userId, oldPassword, newPassword string) error
}

type currentUserService struct {
	userService    userService.UserService
	sessionService sessionService.SessionService
	logger         logger.Logger
}

func NewCurrentUser(userService userService.UserService, sessionService sessionService.SessionService, logger logger.Logger) CurrentUserService {
	return &currentUserService{userService: userService, sessionService: sessionService, logger: logger}
}

func (s *currentUserService) UpdateCredentials(ctx context.Context, userId, firstName, lastName, email, preferredLang string) error {
	return s.userService.UpdateCredentials(ctx, userId, firstName, lastName, email, preferredLang)
}

func (s *currentUserService) ChangePassword(ctx context.Context, userId string, oldPassword, newPassword string) error {
	foundUser, err := s.userService.GetById(ctx, userId)
	if err != nil {
		return err
	}
	if !foundUser.GetPassword().Compare(oldPassword) {
		return ErrOldPasswordDoesNotMatch
	}
	err = s.userService.UpdatePassword(ctx, foundUser.GetId().String(), newPassword)
	if err != nil {
		return err
	}
	return s.sessionService.DeleteAllSessionsByUserId(ctx, userId)
}
