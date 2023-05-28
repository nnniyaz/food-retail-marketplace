package service

import (
	"context"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/env"
	"github/nnniyaz/ardo/pkg/repository"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type Auth struct {
	repo *repository.Repository
}

func NewAuthService(repo *repository.Repository) *Auth {
	return &Auth{repo: repo}
}

const defaultUserType = base.UserTypeClient

func (a *Auth) Login(ctx context.Context, login domain.Login) (uuid.UUID, error) {
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

	if len(sessions) >= 5 {
		latest := sessions[0]
		for _, session := range sessions {
			if session.CreatedAt.After(latest.CreatedAt) {
				latest = session
			}
		}

		err = a.repo.RepoSession.DeleteSessionById(ctx, latest.Id)

		if err != nil {
			return uuid.Nil, err
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

func (a *Auth) Logout(ctx context.Context, token uuid.UUID) error {
	return a.repo.RepoSession.DeleteSessionByToken(ctx, token)
}

func (a *Auth) Register(ctx context.Context, register domain.Register) error {
	apiUri := env.MustGetEnv("API_URI")

	err := register.Validate()

	if err != nil {
		return err
	}

	user, err := a.repo.RepoUser.GetUser(ctx, register.Email)

	if err != nil {
		return err
	}

	if user != (domain.User{}) {
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

	if user == (domain.User{}) {
		err = a.repo.RepoUser.CreateUser(ctx, newUser)
	}

	if err != nil {
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

	link := apiUri + "/auth/confirm/" + newActivationLink.String()

	err = SendEmail(string(register.Email), link)

	return err
}

func (a *Auth) Confirm(ctx context.Context, link uuid.UUID) error {
	err := a.repo.RepoLink.UpdateActivationLink(ctx, link)
	return err
}
