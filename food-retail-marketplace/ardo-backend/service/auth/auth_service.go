package auth

import (
	"context"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/env"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/mail"
	"golang.org/x/crypto/bcrypt"
	"sort"
	"time"
)

const maxSessionsCount = 5
const defaultUserType = base.UserTypeClient

type AuthService interface {
	Login(ctx context.Context, auth domain.Login) (uuid.UUID, error)
	Register(ctx context.Context, user domain.Register) error
	Logout(ctx context.Context, token uuid.UUID) error
	Confirm(ctx context.Context, link uuid.UUID) error
}

type authService struct {
	repo *repo.Repository
}

func NewAuthService(repo *repo.Repository) AuthService {
	return &authService{repo: repo}
}

func (a *authService) Login(ctx context.Context, login domain.Login) (uuid.UUID, error) {
	err := login.Validate()

	if err != nil {
		return uuid.Nil, err
	}

	user, err := a.repo.RepoUser.GetUser(ctx, login.Email)

	if err != nil {
		return uuid.Nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password))

	if err != nil {
		return uuid.Nil, err
	}

	sessions, err := a.repo.RepoSession.GetSessionsByUserId(ctx, user.Id)

	if err != nil {
		return uuid.Nil, err
	}

	if len(sessions) >= maxSessionsCount {
		sort.Slice(sessions, func(i, j int) bool {
			return sessions[i].CreatedAt.Before(sessions[j].CreatedAt)
		})

		for i := 0; i < len(sessions)-maxSessionsCount+1; i++ {
			if err = a.repo.RepoSession.DeleteSessionById(ctx, sessions[i].Id); err != nil {
				return uuid.Nil, err
			}
		}
	}

	token, err := uuid.NewV4()

	if err != nil {
		return uuid.Nil, err
	}

	err = a.repo.RepoSession.CreateSession(ctx, domain.Session{
		UserID:    user.Id,
		Session:   token,
		CreatedAt: time.Now(),
	})

	return token, err
}

func (a *authService) Logout(ctx context.Context, token uuid.UUID) error {
	return a.repo.RepoSession.DeleteSessionByToken(ctx, token)
}

func (a *authService) Register(ctx context.Context, register domain.Register) error {
	apiUri := env.MustGetEnv("API_URI")

	if err := register.Validate(); err != nil {
		return err
	}

	user, err := a.repo.RepoUser.GetUser(ctx, register.Email)
	if err != nil {
		return err
	}
	if user != nil {
		return base.ErrorEmailAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	id, err := uuid.NewV4()
	if err != nil {
		return err
	}

	userType, err := base.NewUserType(defaultUserType)
	if err != nil {
		return err
	}

	newUser := domain.User{
		Id:        id,
		Email:     register.Email,
		Password:  string(hashedPassword),
		FirstName: register.FirstName,
		LastName:  register.LastName,
		UserType:  userType,
		IsDeleted: false,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err = a.repo.RepoUser.CreateUser(ctx, newUser); err != nil {
		return err
	}

	newActivationLink, err := uuid.NewV4()
	if err != nil {
		return err
	}

	err = a.repo.RepoLink.CreateActivationLink(ctx, domain.ActivationLink{
		UserId:      newUser.Id,
		Link:        newActivationLink,
		IsActivated: false,
	})
	if err != nil {
		return err
	}

	link := apiUri + "/authService/confirm/" + newActivationLink.String()
	return mail.SendEmail(string(register.Email), link)
}

func (a *authService) Confirm(ctx context.Context, link uuid.UUID) error {
	return a.repo.RepoLink.UpdateActivationLinkIsActivated(ctx, link)
}
