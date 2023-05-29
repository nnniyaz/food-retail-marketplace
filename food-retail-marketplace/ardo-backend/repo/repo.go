package repo

import (
	"context"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	mongo2 "github/nnniyaz/ardo/repo/mongo"
	"go.mongodb.org/mongo-driver/mongo"
)

type IRepoUser interface {
	GetUser(ctx context.Context, email base.Email) (*domain.User, error)
	CreateUser(ctx context.Context, user domain.User) error
}

type IRepoSession interface {
	CreateSession(ctx context.Context, session domain.Session) error
	GetSessionsByUserId(ctx context.Context, userId uuid.UUID) ([]domain.Session, error)
	DeleteSessionById(ctx context.Context, id uuid.UUID) error
	DeleteSessionByToken(ctx context.Context, token uuid.UUID) error
}

type IRepoLink interface {
	CreateActivationLink(ctx context.Context, activationLink domain.ActivationLink) error
	UpdateActivationLinkIsActivated(ctx context.Context, link uuid.UUID) error
	GetActivationLink(ctx context.Context, link uuid.UUID) (activationLink domain.ActivationLink, err error)
	GetAllActivationLinks(ctx context.Context, user uuid.UUID) ([]domain.ActivationLink, error)
	DeleteActivationLink(ctx context.Context, user uuid.UUID, link uuid.UUID) error
	DeleteAllActivationLinks(ctx context.Context, user uuid.UUID) error
}

type Repository struct {
	RepoUser    IRepoUser
	RepoSession IRepoSession
	RepoLink    IRepoLink
}

func NewRepository(client mongo.Client) *Repository {
	return &Repository{
		RepoUser:    mongo2.NewRepoUser(client),
		RepoSession: mongo2.NewRepoSession(client),
		RepoLink:    mongo2.NewRepoLink(client),
	}
}
