package auth

import (
	"context"
	"fmt"
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user/exception"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	linkService "github/nnniyaz/ardo/service/link"
	sessionService "github/nnniyaz/ardo/service/session"
	userService "github/nnniyaz/ardo/service/user"
	"go.uber.org/zap"
	"sort"
)

const maxSessionsCount = 5
const defaultUserType = valueobject.UserTypeClient

var (
	ErrEmailNotFound      = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_DOESNT_EXIST)
	ErrInvalidPassword    = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PASSWORD)
	ErrEmailAlreadyExists = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_ALREADY_EXISTS)
	ErrAccountNotActive   = core.NewI18NError(core.EINVALID, core.TXT_ACCOUNT_NOT_ACTIVE)
	ErrUnauthorized       = core.NewI18NError(core.EUNAUTHORIZED, core.TXT_UNAUTHORIZED)
)

type AuthService interface {
	Login(ctx context.Context, email, password, userAgent string) (base.UUID, error)
	Register(ctx context.Context, firstName, lastName, email, password string) error
	Logout(ctx context.Context, session string) error
	Confirm(ctx context.Context, link string) error
	UserCheck(ctx context.Context, session string, userAgent string) (*user.User, error)
}

type authService struct {
	userService    userService.UserService
	linkService    linkService.ActivationLinkService
	sessionService sessionService.SessionService
	logger         logger.Logger
	config         *config.Config
	emailService   email.Email
}

func NewAuthService(userService userService.UserService, sessionService sessionService.SessionService, linkService linkService.ActivationLinkService, l logger.Logger, config *config.Config, emailService email.Email) AuthService {
	return &authService{linkService: linkService, userService: userService, sessionService: sessionService, logger: l, config: config, emailService: emailService}
}

func (a *authService) Login(ctx context.Context, email, password, userAgent string) (base.UUID, error) {
	u, err := a.userService.GetByEmail(ctx, email)
	if err != nil {
		return base.Nil, ErrEmailNotFound
	}

	ok := u.ComparePassword(password)
	if !ok {
		return base.Nil, ErrInvalidPassword
	}

	foundActivationLink, err := a.linkService.GetByUserId(ctx, u.GetId().String())
	if err != nil {
		return base.Nil, err
	}
	if !foundActivationLink.GetIsActivated() {
		return base.Nil, ErrAccountNotActive
	}

	sessions, err := a.sessionService.GetAllByUserId(ctx, u.GetId().String())
	if err != nil {
		return base.Nil, err
	}

	if len(sessions) >= maxSessionsCount {
		sort.Slice(sessions, func(i, j int) bool {
			return sessions[i].GetCreatedAt().Before(sessions[j].GetCreatedAt())
		})

		for i := 0; i < len(sessions)-maxSessionsCount+1; i++ {
			if err = a.sessionService.DeleteOneBySessionId(ctx, sessions[i].GetId().String()); err != nil {
				return base.Nil, err
			}
		}
	}

	newSession, err := a.sessionService.Create(ctx, u.GetId().String(), userAgent)
	if err != nil {
		return base.Nil, err
	}
	return newSession.GetSession(), nil
}

func (a *authService) Logout(ctx context.Context, token string) error {
	return a.sessionService.DeleteOneByToken(ctx, token)
}

func (a *authService) Register(ctx context.Context, firstName, lastName, email, password string) error {
	if u, err := a.userService.GetByEmail(ctx, email); err != nil || u != nil {
		if err != nil {
			return err
		}

		foundActivationLink, err := a.linkService.GetByUserId(ctx, u.GetId().String())
		if err != nil {
			return err
		}
		if foundActivationLink != nil && !u.GetIsDeleted() {
			if foundActivationLink.GetIsActivated() {
				return ErrEmailAlreadyExists
			}

			if !u.ComparePassword(password) {
				err = a.userService.UpdatePassword(ctx, u.GetId().String(), password)
				if err != nil {
					return err
				}
			}
			foundActivationLink.UpdateLink()
			link := a.config.GetApiUri() + "/api/auth/confirm/" + foundActivationLink.GetLink().String()

			subject := "Confirm your email"
			htmlBody := fmt.Sprintf("<p>Hi %s,</p><p>Thanks for signing up for Ardo! We're excited to have you as an early user.</p><p>Click the link below to confirm your email address:</p><p><a href=\"%s\">%s</a></p><p>Thanks,<br/>The Ardo Team</p>", u.GetFirstName(), link, link)
			return a.emailService.SendMail([]string{email}, subject, htmlBody)
		}
	}

	newUser, err := a.userService.Create(ctx, firstName, lastName, email, password, defaultUserType.String())
	if err != nil {
		return err
	}

	newActivationLink, err := a.linkService.Create(ctx, newUser.GetId().String())
	if err != nil {
		return err
	}

	link := a.config.GetApiUri() + "/api/auth/confirm/" + newActivationLink.GetLink().String()
	subject := "Confirm your email"
	htmlBody := fmt.Sprintf("<p>Hi %s,</p><p>Thanks for signing up for Ardo! We're excited to have you as an early user.</p><p>Click the link below to confirm your email address:</p><p><a href=\"%s\">%s</a></p><p>Thanks,<br/>The Ardo Team</p>", newUser.GetFirstName(), link, link)
	return a.emailService.SendMail([]string{newUser.GetEmail().String()}, subject, htmlBody)
}

func (a *authService) Confirm(ctx context.Context, link string) error {
	return a.linkService.UpdateIsActivated(ctx, link, true)
}

func (a *authService) UserCheck(ctx context.Context, key string, userAgent string) (*user.User, error) {
	userSession, err := a.sessionService.GetOneBySession(ctx, key)
	if err != nil {
		if err != exception.ErrUserSessionNotFound {
			return nil, err
		}
		return nil, ErrUnauthorized
	}

	if userSession.GetUserAgent().String() != userAgent {
		if err = a.sessionService.DeleteOneByToken(ctx, key); err != nil {
			a.logger.Error("failed to delete user session", zap.Error(err))
		}
		return nil, ErrUnauthorized
	}

	if err = a.sessionService.UpdateLastActionAt(ctx, userSession.GetId().String()); err != nil {
		return nil, err
	}
	return a.userService.GetById(ctx, userSession.GetUserId().String())
}
