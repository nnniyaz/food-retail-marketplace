package organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

var (
	ErrOrganizationNotFound = core.NewI18NError(core.EINVALID, core.TXT_ORG_NOT_FOUND)
)

type RepoOrganization struct {
	client *mongo.Client
}

func NewRepoOrganization(client *mongo.Client) *RepoOrganization {
	return &RepoOrganization{client: client}
}

func (r *RepoOrganization) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("organizations")
}

type mongoContacts struct {
	Phone   string `bson:"phone"`
	Email   string `bson:"email"`
	Address string `bson:"address"`
}

func newFromContacts(c valueobject.OrgContact) mongoContacts {
	return mongoContacts{
		Phone:   c.GetPhone().String(),
		Email:   c.GetEmail().String(),
		Address: c.GetAddress(),
	}
}

func (m *mongoContacts) ToAggregate() (valueobject.OrgContact, error) {
	contact, err := valueobject.UnmarshalOrgContactFromDatabase(m.Phone, m.Email, m.Address)
	if err != nil {
		return valueobject.OrgContact{}, err
	}
	return contact, nil
}

type mongoOrganization struct {
	Id        uuid.UUID           `bson:"_id"`
	Logo      string              `bson:"logo"`
	Name      string              `bson:"name"`
	Desc      valueobject.OrgDesc `bson:"desc"`
	Contacts  mongoContacts       `bson:"contacts"`
	Currency  string              `bson:"currency"`
	IsDeleted bool                `bson:"isDeleted"`
	CreatedAt time.Time           `bson:"createdAt"`
	UpdatedAt time.Time           `bson:"updatedAt"`
}

func newFromOrganization(o *organization.Organization) *mongoOrganization {
	return &mongoOrganization{
		Id:        o.GetId(),
		Logo:      o.GetLogo(),
		Name:      o.GetName().String(),
		Desc:      o.GetDesc(),
		Contacts:  newFromContacts(o.GetContacts()),
		Currency:  o.GetCurrency().String(),
		IsDeleted: o.GetIsDeleted(),
		CreatedAt: o.GetCreatedAt(),
		UpdatedAt: o.GetUpdatedAt(),
	}
}

func (m *mongoOrganization) ToAggregate() (*organization.Organization, error) {
	contacts, err := valueobject.NewOrgContact(m.Contacts.Phone, m.Contacts.Email, m.Contacts.Address)
	if err != nil {
		return nil, err
	}
	return organization.UnmarshalOrganizationFromDatabase(m.Id, m.Logo, m.Name, m.Currency, m.Desc, contacts, m.IsDeleted, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoOrganization) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*organization.Organization, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(nil)

	var organizations []*organization.Organization
	for cur.Next(nil) {
		var o mongoOrganization
		if err = cur.Decode(&o); err != nil {
			return nil, 0, err
		}
		org, err := o.ToAggregate()
		if err != nil {
			return nil, 0, err
		}
		organizations = append(organizations, org)
	}
	return organizations, count, nil
}

func (r *RepoOrganization) FindOneById(ctx context.Context, id uuid.UUID) (*organization.Organization, error) {
	var o mongoOrganization
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&o); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, ErrOrganizationNotFound
		}
		return nil, err
	}
	return o.ToAggregate()
}

func (r *RepoOrganization) Create(ctx context.Context, o *organization.Organization) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrganization(o))
	return err
}

func (r *RepoOrganization) UpdateOrgInfo(ctx context.Context, id uuid.UUID, name valueobject.OrgName, logo string, desc valueobject.OrgDesc, contacts valueobject.OrgContact, currency valueobject.Currency) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"name":      name.String(),
			"logo":      logo,
			"desc":      desc,
			"contacts":  newFromContacts(contacts),
			"currency":  currency.String(),
			"updatedAt": time.Now(),
		},
	})
	return err
}

func (r *RepoOrganization) UpdateOrgLogo(ctx context.Context, id uuid.UUID, logo string) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"logo":      logo,
			"updatedAt": time.Now(),
		},
	})
	return err
}

func (r *RepoOrganization) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
	})
	return err
}
