package auth

import (
	"context"
	"errors"
	"fmt"
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/domain/user"
	exceptionsUser "github/nnniyaz/ardo/domain/user/exceptions"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	linkService "github/nnniyaz/ardo/service/link"
	sessionService "github/nnniyaz/ardo/service/session"
	userService "github/nnniyaz/ardo/service/user"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
	"sort"
)

const maxSessionsCount = 5
const defaultUserType = valueobject.UserTypeAdmin

var (
	ErrEmailNotFound      = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_DOESNT_EXIST)
	ErrInvalidPassword    = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PASSWORD)
	ErrEmailAlreadyExists = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_ALREADY_EXISTS)
	ErrAccountNotActive   = core.NewI18NError(core.EINVALID, core.TXT_ACCOUNT_NOT_ACTIVE)
	ErrUnauthorized       = core.NewI18NError(core.EUNAUTHORIZED, core.TXT_UNAUTHORIZED)
)

type AuthService interface {
	Login(ctx context.Context, email, password, userAgent string) (uuid.UUID, error)
	Register(ctx context.Context, firstName, lastName, email, password, preferredLang string) error
	Logout(ctx context.Context, session string) error
	Confirm(ctx context.Context, link string) error
	UserCheck(ctx context.Context, session string, userAgent string) (*user.User, error)
}

type authService struct {
	logger         logger.Logger
	config         *config.Config
	emailService   email.Email
	userService    userService.UserService
	sessionService sessionService.SessionService
	linkService    linkService.ActivationLinkService
}

func NewAuthService(l logger.Logger, config *config.Config, emailService email.Email, userService userService.UserService, sessionService sessionService.SessionService, linkService linkService.ActivationLinkService) AuthService {
	return &authService{logger: l, config: config, emailService: emailService, userService: userService, sessionService: sessionService, linkService: linkService}
}

func (a *authService) Login(ctx context.Context, email, password, userAgent string) (uuid.UUID, error) {
	u, err := a.userService.GetByEmail(ctx, email)
	if err != nil {
		return uuid.Nil, ErrEmailNotFound
	}

	if u == nil || u.GetIsDeleted() {
		return uuid.Nil, ErrEmailNotFound
	}

	ok := u.ComparePassword(password)
	if !ok {
		return uuid.Nil, ErrInvalidPassword
	}

	foundActivationLink, err := a.linkService.GetByUserId(ctx, u.GetId().String())
	if err != nil && !errors.Is(mongo.ErrNoDocuments, err) {
		return uuid.Nil, err
	}
	if foundActivationLink == nil || !foundActivationLink.GetIsActivated() {
		return uuid.Nil, ErrAccountNotActive
	}

	sessions, err := a.sessionService.GetAllByUserId(ctx, u.GetId().String())
	if err != nil {
		return uuid.Nil, err
	}

	if len(sessions) >= maxSessionsCount {
		sort.Slice(sessions, func(i, j int) bool {
			return sessions[i].GetCreatedAt().Before(sessions[j].GetCreatedAt())
		})

		for i := 0; i < len(sessions)-maxSessionsCount+1; i++ {
			if err = a.sessionService.DeleteOneBySessionId(ctx, sessions[i].GetId().String()); err != nil {
				return uuid.Nil, err
			}
		}
	}

	newSession, err := session.NewSession(u.GetId(), userAgent)
	if err = a.sessionService.Create(ctx, newSession); err != nil {
		return uuid.Nil, err
	}
	return newSession.GetSession(), nil
}

func (a *authService) Logout(ctx context.Context, token string) error {
	return a.sessionService.DeleteOneByToken(ctx, token)
}

func (a *authService) Register(ctx context.Context, firstName, lastName, email, password, preferredLang string) error {
	if u, err := a.userService.GetByEmail(ctx, email); err != nil && err != exceptionsUser.ErrUserNotFound || u != nil {
		if err != nil && err != exceptionsUser.ErrUserNotFound {
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
				err = a.userService.UpdatePassword(ctx, u, password)
				if err != nil {
					return err
				}
			}
			foundActivationLink.UpdateLinkId()
			err = a.linkService.UpdateLink(ctx, foundActivationLink)

			link := a.config.GetApiUri() + "/api/auth/confirm/" + foundActivationLink.GetLinkId().String()

			subject := "Confirm your email"
			htmlBody := fmt.Sprintf("<p>Hi %s,</p><p>Thanks for signing up for Ardo! We're excited to have you as an early user.</p><p>Click the link below to confirm your email address:</p><p><a href=\"%s\">%s</a></p><p>Thanks,<br/>The Ardo Team</p>", u.GetFirstName(), link, link)
			return a.emailService.SendMail([]string{email}, subject, htmlBody)
		}
	}

	newUser, err := user.NewUser(firstName, lastName, email, password, defaultUserType.String(), preferredLang)
	if err = a.userService.Create(ctx, newUser); err != nil {
		return err
	}

	newActivationLink := activationLink.NewActivationLink(newUser.GetId())
	err = a.linkService.Create(ctx, newActivationLink)
	if err != nil {
		return err
	}

	link := a.config.GetApiUri() + "/api/auth/confirm/" + newActivationLink.GetLinkId().String()
	subject := "Confirm your email"
	htmlBody := fmt.Sprintf("<p>Hi %s,</p><p>Thanks for signing up for Ardo! We're excited to have you as an early user.</p><p>Click the link below to confirm your email address:</p><p><a href=\"%s\">%s</a></p><p>Thanks,<br/>The Ardo Team</p>", newUser.GetFirstName(), link, link)
	return a.emailService.SendMail([]string{newUser.GetEmail().String()}, subject, htmlBody)
}

func (a *authService) Confirm(ctx context.Context, link string) error {
	return a.linkService.UpdateIsActivated(ctx, link, true)
}

func (a *authService) UserCheck(ctx context.Context, key string, userAgent string) (*user.User, error) {
	userSession, err := a.sessionService.GetOneBySession(ctx, key)
	if userSession == nil {
		return nil, ErrUnauthorized
	}
	if err != nil {
		return nil, err
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
