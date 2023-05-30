package repo

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user/valueobject"
	activationLinkMongo "github/nnniyaz/ardo/repo/mongo/activationLink"
	sessionMongo "github/nnniyaz/ardo/repo/mongo/session"
	userMongo "github/nnniyaz/ardo/repo/mongo/user"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	Find(ctx context.Context) ([]*user.User, error)
	FindOneById(ctx context.Context, id base.UUID) (*user.User, error)
	FindOneByEmail(ctx context.Context, email valueobject.Email) (*user.User, error)
	Create(ctx context.Context, user *user.User) error
	Update(ctx context.Context, user *user.User) error
	Delete(ctx context.Context, id base.UUID) error
}

type Session interface {
	CreateSession(ctx context.Context, session *session.Session) error
	GetSessionsByUserId(ctx context.Context, userId base.UUID) ([]*session.Session, error)
	DeleteSessionById(ctx context.Context, id base.UUID) error
	DeleteSessionByToken(ctx context.Context, token base.UUID) error
}

type ActivationLink interface {
	Find(ctx context.Context, user base.UUID) ([]*activationLink.ActivationLink, error)
	FindOneByUserId(ctx context.Context, userId base.UUID) (activationLink *activationLink.ActivationLink, err error)
	FindOneByLink(ctx context.Context, link base.UUID) (activationLink *activationLink.ActivationLink, err error)
	Create(ctx context.Context, activationLink *activationLink.ActivationLink) error
	Update(ctx context.Context, activationLink *activationLink.ActivationLink) error
	DeleteAll(ctx context.Context, user base.UUID) error
	DeleteOne(ctx context.Context, user base.UUID) error
}

type Repository struct {
	RepoUser           User
	RepoSession        Session
	RepoActivationLink ActivationLink
}

func NewRepository(client mongo.Client) *Repository {
	return &Repository{
		RepoUser:           userMongo.NewRepoUser(client),
		RepoSession:        sessionMongo.NewRepoSession(client),
		RepoActivationLink: activationLinkMongo.NewRepoActivationLink(client),
	}
}
