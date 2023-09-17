package repo

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/email"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization"
	OrgValueObject "github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/domain/user"
	UserValueObject "github/nnniyaz/ardo/domain/user/valueobject"
	"github/nnniyaz/ardo/domain/user_organization"
	UserOrgValueObject "github/nnniyaz/ardo/domain/user_organization/valueobject"
	activationLinkMongo "github/nnniyaz/ardo/repo/mongo/activationLink"
	organizationMongo "github/nnniyaz/ardo/repo/mongo/organization"
	productMongo "github/nnniyaz/ardo/repo/mongo/product"
	sessionMongo "github/nnniyaz/ardo/repo/mongo/session"
	userMongo "github/nnniyaz/ardo/repo/mongo/user"
	userOrganizationMongo "github/nnniyaz/ardo/repo/mongo/user_organization"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*user.User, error)
	FindOneByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, user *user.User) error
	UpdateUserCredentials(ctx context.Context, userId uuid.UUID, firstName UserValueObject.FirstName, lastName UserValueObject.LastName, email email.Email) error
	UpdateUserPassword(ctx context.Context, userId uuid.UUID, password UserValueObject.Password) error
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
	Find(ctx context.Context, user uuid.UUID) ([]*activationLink.ActivationLink, error)
	FindOneByUserId(ctx context.Context, userId uuid.UUID) (activationLink *activationLink.ActivationLink, err error)
	FindOneByLink(ctx context.Context, link uuid.UUID) (activationLink *activationLink.ActivationLink, err error)
	Create(ctx context.Context, activationLink *activationLink.ActivationLink) error
	Update(ctx context.Context, activationLink *activationLink.ActivationLink) error
	DeleteAll(ctx context.Context, user uuid.UUID) error
	DeleteOne(ctx context.Context, user uuid.UUID) error
}

type Organization interface {
	FindByFilters(ctx context.Context, limit, offset int64, isDeleted bool) ([]*organization.Organization, int64, error)
	FindOneById(ctx context.Context, id uuid.UUID) (*organization.Organization, error)
	Create(ctx context.Context, o *organization.Organization) error
	UpdateOrgInfo(ctx context.Context, id uuid.UUID, name OrgValueObject.OrgName, logo string, desc OrgValueObject.OrgDesc, contacts OrgValueObject.OrgContact, currency OrgValueObject.Currency) error
	UpdateOrgLogo(ctx context.Context, id uuid.UUID, logo string) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type UserOrganization interface {
	Find(ctx context.Context) ([]*user_organization.UserOrganization, error)
	FindOneByUserIdAndOrgId(ctx context.Context, userId, orgId uuid.UUID, isDeleted bool) (*user_organization.UserOrganization, error)
	FindUsersByOrgId(ctx context.Context, orgId uuid.UUID, offset, limit int64, isDeleted bool) ([]*user_organization.UserOrganization, int64, error)
	Create(ctx context.Context, organization *user_organization.UserOrganization) error
	UpdateMerchantRole(ctx context.Context, orgId, userId uuid.UUID, role UserOrgValueObject.MerchantRole) error
	DeleteOrg(ctx context.Context, orgId uuid.UUID) error
	DeleteUserFromAllOrgs(ctx context.Context, userId uuid.UUID) error
	DeleteUserFromOrg(ctx context.Context, orgId, userId uuid.UUID) error
}

type Product interface {
	Find(ctx context.Context) ([]*product.Product, error)
	FindById(ctx context.Context, id uuid.UUID) (*product.Product, error)
	FindByOrgId(ctx context.Context, orgId uuid.UUID) ([]*product.Product, error)
	FindBySectionId(ctx context.Context, sectionId uuid.UUID) ([]*product.Product, error)
	FindByCategoryId(ctx context.Context, categoryId uuid.UUID) ([]*product.Product, error)
	Create(ctx context.Context, p *product.Product) error
	Update(ctx context.Context, p *product.Product) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type Repository struct {
	RepoUser             User
	RepoSession          Session
	RepoActivationLink   ActivationLink
	RepoOrganization     Organization
	RepoUserOrganization UserOrganization
	RepoProduct          Product
}

func NewRepository(client *mongo.Client) *Repository {
	return &Repository{
		RepoUser:             userMongo.NewRepoUser(client),
		RepoSession:          sessionMongo.NewRepoSession(client),
		RepoActivationLink:   activationLinkMongo.NewRepoActivationLink(client),
		RepoOrganization:     organizationMongo.NewRepoOrganization(client),
		RepoUserOrganization: userOrganizationMongo.NewRepoUserOrganization(client),
		RepoProduct:          productMongo.NewRepoProduct(client),
	}
}
