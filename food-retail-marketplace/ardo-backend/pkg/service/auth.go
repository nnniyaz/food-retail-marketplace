package service

import (
	"context"
	"errors"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
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

func (a *Auth) Login(ctx context.Context, login domain.Login) (uuid.UUID, error) {
	if login.Email == "" {
		return uuid.Nil, errors.New("email is empty")
	}

	if login.Password == "" {
		return uuid.Nil, errors.New("password is empty")
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

func (a *Auth) Register(ctx context.Context, register domain.Register) (uuid.UUID, error) {
	if register.Email == "" {
		return uuid.Nil, errors.New("email is empty")
	}

	if register.Password == "" {
		return uuid.Nil, errors.New("password is empty")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)

	if err != nil {
		return uuid.Nil, err
	}

	id, err := uuid.NewV4()

	if err != nil {
		return uuid.Nil, err
	}

	err = a.repo.RepoUser.CreateUser(ctx, domain.User{
		Id:        id,
		Email:     register.Email,
		Password:  string(hashedPassword),
		FirstName: register.FirstName,
		LastName:  register.LastName,
	})

	return id, err
}
