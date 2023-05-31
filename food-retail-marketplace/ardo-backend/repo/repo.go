package repo

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/domain/user"
	activationLinkMongo "github/nnniyaz/ardo/repo/mongo/activationLink"
	organizationMongo "github/nnniyaz/ardo/repo/mongo/organization"
	sessionMongo "github/nnniyaz/ardo/repo/mongo/session"
	userMongo "github/nnniyaz/ardo/repo/mongo/user"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	Find(ctx context.Context) ([]*user.User, error)
	FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*user.User, error)
	FindOneByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, user *user.User) error
	Update(ctx context.Context, user *user.User) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type Session interface {
	CreateSession(ctx context.Context, session *session.Session) error
	GetSessionsByUserId(ctx context.Context, userId uuid.UUID) ([]*session.Session, error)
	DeleteSessionById(ctx context.Context, id uuid.UUID) error
	DeleteSessionByToken(ctx context.Context, token uuid.UUID) error
}

type ActivationLink interface {
	Find(ctx context.Context, user uuid.UUID) ([]*activationLink.ActivationLink, error)
	FindOneByUserId(ctx context.Context, userId uuid.UUID) (activationLink *activationLink.ActivationLink, err error)
	FindOneByLink(ctx context.Context, link uuid.UUID) (activationLink *activationLink.ActivationLink, err error)
	Create(ctx context.Context, activationLink *activationLink.ActivationLink) error
	Update(ctx context.Context, activationLink *activationLink.ActivationLink) error
	DeleteAll(ctx context.Context, user uuid.UUID) error
	DeleteOne(ctx context.Context, user uuid.UUID) error
}

type Organization interface {
	Find(ctx context.Context) ([]*organization.Organization, error)
	FindOneByOrgId(ctx context.Context, orgId uuid.UUID) (*organization.Organization, error)
	Create(ctx context.Context, organization *organization.Organization) error
	UpdateMerchantRole(ctx context.Context, orgId uuid.UUID, role valueobject.MerchantRole) error
	Delete(ctx context.Context, orgId uuid.UUID) error
}

type Repository struct {
	RepoUser           User
	RepoSession        Session
	RepoActivationLink ActivationLink
	RepoOrganization   Organization
}

func NewRepository(client mongo.Client) *Repository {
	return &Repository{
		RepoUser:           userMongo.NewRepoUser(client),
		RepoSession:        sessionMongo.NewRepoSession(client),
		RepoActivationLink: activationLinkMongo.NewRepoActivationLink(client),
		RepoOrganization:   organizationMongo.NewRepoOrganization(client),
	}
}
