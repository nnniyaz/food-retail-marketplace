package auth

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/env"
	linkService "github/nnniyaz/ardo/service/link"
	mailService "github/nnniyaz/ardo/service/mail"
	sessionService "github/nnniyaz/ardo/service/session"
	userService "github/nnniyaz/ardo/service/user"
	"sort"
)

const maxSessionsCount = 5
const defaultUserType = "client"

var (
	ErrEmailNotFound      = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_DOESNT_EXIST)
	ErrInvalidPassword    = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PASSWORD)
	ErrEmailAlreadyExists = core.NewI18NError(core.EINVALID, core.TXT_EMAIL_ALREADY_EXISTS)
	ErrAccountNotActive   = core.NewI18NError(core.EINVALID, core.TXT_ACCOUNT_NOT_ACTIVE)
)

type AuthService interface {
	Login(ctx context.Context, email, password string) (uuid.UUID, error)
	Register(ctx context.Context, firstName, lastName, email, password string) error
	Logout(ctx context.Context, token string) error
	Confirm(ctx context.Context, link string) error
}

type authService struct {
	userService    userService.UserService
	linkService    linkService.ActivationLinkService
	sessionService sessionService.SessionService
}

func NewAuthService(userService userService.UserService, sessionService sessionService.SessionService, linkService linkService.ActivationLinkService) AuthService {
	return &authService{linkService: linkService, userService: userService, sessionService: sessionService}
}

func (a *authService) Login(ctx context.Context, email, password string) (uuid.UUID, error) {
	user, err := a.userService.GetByEmail(ctx, email)
	if err != nil {
		return uuid.Nil, ErrEmailNotFound
	}

	ok := user.ComparePassword(password)
	if !ok {
		return uuid.Nil, ErrInvalidPassword
	}

	foundActivationLink, err := a.linkService.GetByUserId(ctx, user.GetId().String())
	if err != nil {
		return uuid.Nil, err
	}
	if !foundActivationLink.GetIsActivated() {
		return uuid.Nil, ErrAccountNotActive
	}

	sessions, err := a.sessionService.GetAllByUserId(ctx, user.GetId().String())
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

	newSession, err := a.sessionService.Create(ctx, user.GetId().String())
	if err != nil {
		return uuid.Nil, err
	}
	return newSession.GetSession(), nil
}

func (a *authService) Logout(ctx context.Context, token string) error {
	return a.sessionService.DeleteOneByToken(ctx, token)
}

func (a *authService) Register(ctx context.Context, firstName, lastName, email, password string) error {
	apiUri := env.MustGetEnv("API_URI")

	if user, err := a.userService.GetByEmail(ctx, email); err != nil || user != nil {
		if err != nil {
			return err
		}

		foundActivationLink, err := a.linkService.GetByUserId(ctx, user.GetId().String())
		if err != nil {
			return err
		}
		if foundActivationLink != nil && !user.GetIsDeleted() {
			if foundActivationLink.GetIsActivated() {
				return ErrEmailAlreadyExists
			}

			if !user.ComparePassword(password) {
				err = a.userService.UpdatePassword(ctx, user.GetId().String(), password)
				if err != nil {
					return err
				}
			}
			foundActivationLink.UpdateLink()
			link := apiUri + "/api/auth/confirm/" + foundActivationLink.GetLink().String()
			return mailService.SendEmail(email, link)
		}
	}

	newUser, err := a.userService.Create(ctx, firstName, lastName, email, password, defaultUserType)
	if err != nil {
		return err
	}

	newActivationLink, err := a.linkService.Create(ctx, newUser.GetId().String())
	if err != nil {
		return err
	}

	link := apiUri + "/api/auth/confirm/" + newActivationLink.GetLink().String()
	return mailService.SendEmail(newUser.GetEmail().String(), link)
}

func (a *authService) Confirm(ctx context.Context, link string) error {
	return a.linkService.UpdateIsActivated(ctx, link, true)
}
