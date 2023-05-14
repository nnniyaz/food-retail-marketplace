package repository

import (
	"context"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"go.mongodb.org/mongo-driver/mongo"
)

type IRepoUser interface {
	GetUser(ctx context.Context, email base.Email) (domain.User, error)
	CreateUser(ctx context.Context, user domain.User) error
}

type IRepoSession interface {
	CreateSession(ctx context.Context, session domain.Session) error
	GetSessionsByUserId(ctx context.Context, userId uuid.UUID) ([]domain.Session, error)
	DeleteSessionById(ctx context.Context, id uuid.UUID) error
	DeleteSessionByToken(ctx context.Context, token uuid.UUID) error
}

type Repository struct {
	RepoUser    IRepoUser
	RepoSession IRepoSession
}

func NewRepository(client mongo.Client) *Repository {
	return &Repository{
		RepoUser:    NewRepoUser(client),
		RepoSession: NewRepoSession(client),
	}
}
