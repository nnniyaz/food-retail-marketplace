package current_user

import (
	"context"
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
}

type currentUserService struct {
	userService    userService.UserService
	sessionService sessionService.SessionService
	logger         logger.Logger
}

func NewCurrentUser(userService userService.UserService, sessionService sessionService.SessionService, logger logger.Logger) CurrentUserService {
	return &currentUserService{userService: userService, sessionService: sessionService, logger: logger}
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
