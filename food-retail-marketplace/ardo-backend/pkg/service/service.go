package service

import (
	"context"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/pkg/repository"
)

type Authorization interface {
	Login(ctx context.Context, auth domain.Login) (uuid.UUID, error)
	Register(ctx context.Context, user domain.Register) (uuid.UUID, error)
	Logout(ctx context.Context, token uuid.UUID) error
}

type Service struct {
	Authorization
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		Authorization: NewAuthService(repos),
	}
}
