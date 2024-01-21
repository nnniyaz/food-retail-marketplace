package repo

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/domain/user"
	activationLinkMongo "github/nnniyaz/ardo/repo/mongo/activationLink"
	orderMongo "github/nnniyaz/ardo/repo/mongo/order"
	productMongo "github/nnniyaz/ardo/repo/mongo/product"
	sessionMongo "github/nnniyaz/ardo/repo/mongo/session"
	userMongo "github/nnniyaz/ardo/repo/mongo/user"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*user.User, error)
	FindOneByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, user *user.User) error
	Update(ctx context.Context, user *user.User) error
	Recover(ctx context.Context, id uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type Session interface {
	Create(ctx context.Context, session *session.Session) error
	FindManyByUserId(ctx context.Context, userId uuid.UUID) ([]*session.Session, error)
	FindOneBySession(ctx context.Context, session uuid.UUID) (*session.Session, error)
	DeleteAllByUserId(ctx context.Context, userId uuid.UUID) error
	DeleteById(ctx context.Context, id uuid.UUID) error
	DeleteByToken(ctx context.Context, token uuid.UUID) error
	UpdateLastActionAt(ctx context.Context, sessionId uuid.UUID) error
}

type ActivationLink interface {
	FindOneByUserId(ctx context.Context, userId uuid.UUID) (activationLink *activationLink.ActivationLink, err error)
	FindOneByLinkId(ctx context.Context, linkId uuid.UUID) (activationLink *activationLink.ActivationLink, err error)
	Create(ctx context.Context, activationLink *activationLink.ActivationLink) error
	Update(ctx context.Context, activationLink *activationLink.ActivationLink) error
}

type Product interface {
	FindByFilters(ctx context.Context, limit, offset int64, isDeleted bool) ([]*product.Product, int64, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*product.Product, error)
	Create(ctx context.Context, p *product.Product) error
	Update(ctx context.Context, p *product.Product) error
	Delete(ctx context.Context, id uuid.UUID) error
	Recover(ctx context.Context, id uuid.UUID) error
}

type Order interface {
	FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error)
	FindUserOrdersByFilters(ctx context.Context, offset, limit int64, isDeleted bool, userId uuid.UUID) ([]*order.Order, int64, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*order.Order, error)
	Create(ctx context.Context, order *order.Order) error
	Update(ctx context.Context, order *order.Order) error
	Recover(ctx context.Context, id uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type Repository struct {
	RepoUser           User
	RepoSession        Session
	RepoActivationLink ActivationLink
	RepoProduct        Product
	RepoOrder          Order
}

func NewRepository(client *mongo.Client) *Repository {
	return &Repository{
		RepoUser:           userMongo.NewRepoUser(client),
		RepoSession:        sessionMongo.NewRepoSession(client),
		RepoActivationLink: activationLinkMongo.NewRepoActivationLink(client),
		RepoProduct:        productMongo.NewRepoProduct(client),
		RepoOrder:          orderMongo.NewRepoOrder(client),
	}
}
