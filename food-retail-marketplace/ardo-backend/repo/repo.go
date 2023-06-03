package repo

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/organization/org_contact"
	"github/nnniyaz/ardo/domain/organization/org_desc"
	"github/nnniyaz/ardo/domain/organization/org_name"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	activationLinkMongo "github/nnniyaz/ardo/repo/mongo/activationLink"
	organizationMongo "github/nnniyaz/ardo/repo/mongo/organization"
	organizationContactMongo "github/nnniyaz/ardo/repo/mongo/organization/org_contact"
	organizationDescMongo "github/nnniyaz/ardo/repo/mongo/organization/org_desc"
	organizationNameMongo "github/nnniyaz/ardo/repo/mongo/organization/org_name"
	sessionMongo "github/nnniyaz/ardo/repo/mongo/session"
	userMongo "github/nnniyaz/ardo/repo/mongo/user"
	userOrganizationMongo "github/nnniyaz/ardo/repo/mongo/user_organization"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	Find(ctx context.Context) ([]*user.User, error)
	FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, error)
	FindOneById(ctx context.Context, id base.UUID) (*user.User, error)
	FindOneByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, user *user.User) error
	Update(ctx context.Context, user *user.User) error
	Delete(ctx context.Context, id base.UUID) error
}

type Session interface {
	Create(ctx context.Context, session *session.Session) error
	FindManyByUserId(ctx context.Context, userId base.UUID) ([]*session.Session, error)
	DeleteById(ctx context.Context, id base.UUID) error
	DeleteByToken(ctx context.Context, token base.UUID) error
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

type Organization interface {
	Find(ctx context.Context) ([]*organization.Organization, error)
	FindById(ctx context.Context, id base.UUID) (*organization.Organization, error)
	Create(ctx context.Context, o *organization.Organization) error
	UpdateOrganization(ctx context.Context, o *organization.Organization) error
	DeleteOrganization(ctx context.Context, id base.UUID) error
	DisableOrganization(ctx context.Context, id base.UUID) error
	EnableOrganization(ctx context.Context, id base.UUID) error
}

type OrganizationName interface {
	FindOne(ctx context.Context, orgId base.UUID) (*org_name.OrgName, error)
	Create(ctx context.Context, o *org_name.OrgName) error
	Update(ctx context.Context, o *org_name.OrgName) error
	Delete(ctx context.Context, o *org_name.OrgName) error
}

type OrganizationDesc interface {
	FindOne(ctx context.Context, orgId base.UUID) (*org_desc.OrgDesc, error)
	Create(ctx context.Context, o *org_desc.OrgDesc) error
	Update(ctx context.Context, o *org_desc.OrgDesc) error
	Delete(ctx context.Context, o *org_desc.OrgDesc) error
}

type OrganizationContacts interface {
	FindOne(ctx context.Context, orgId base.UUID) (*org_contact.OrgContact, error)
	Create(ctx context.Context, o *org_contact.OrgContact) error
	Update(ctx context.Context, o *org_contact.OrgContact) error
	Delete(ctx context.Context, o *org_contact.OrgContact) error
}

type UserOrganization interface {
	Find(ctx context.Context) ([]*user_organization.UserOrganization, error)
	FindOneByOrgId(ctx context.Context, orgId base.UUID) (*user_organization.UserOrganization, error)
	Create(ctx context.Context, organization *user_organization.UserOrganization) error
	UpdateMerchantRole(ctx context.Context, orgId base.UUID, role valueobject.MerchantRole) error
	Delete(ctx context.Context, orgId base.UUID) error
}

type Repository struct {
	RepoUser                 User
	RepoSession              Session
	RepoActivationLink       ActivationLink
	RepoOrganization         Organization
	RepoOrganizationName     OrganizationName
	RepoOrganizationDesc     OrganizationDesc
	RepoOrganizationContacts OrganizationContacts
	RepoUserOrganization     UserOrganization
}

func NewRepository(client mongo.Client) *Repository {
	return &Repository{
		RepoUser:                 userMongo.NewRepoUser(client),
		RepoSession:              sessionMongo.NewRepoSession(client),
		RepoActivationLink:       activationLinkMongo.NewRepoActivationLink(client),
		RepoOrganization:         organizationMongo.NewRepoOrganization(client),
		RepoOrganizationName:     organizationNameMongo.NewRepoOrgName(client),
		RepoOrganizationDesc:     organizationDescMongo.NewRepoOrgDesc(client),
		RepoOrganizationContacts: organizationContactMongo.NewRepoOrgContact(client),
		RepoUserOrganization:     userOrganizationMongo.NewRepoOrganization(client),
	}
}
