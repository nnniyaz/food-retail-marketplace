package organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoOrganization struct {
	client mongo.Client
}

func NewRepoOrganization(client mongo.Client) *RepoOrganization {
	return &RepoOrganization{client: client}
}

func (r *RepoOrganization) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("organizations")
}

type mongoOrganization struct {
	id         base.UUID `bson:"_id"`
	logo       string    `bson:"logo"`
	currency   string    `bson:"currency"`
	isDisabled bool      `bson:"isDisabled"`
	isDeleted  bool      `bson:"isDeleted"`
	createdAt  time.Time `bson:"createdAt"`
	updatedAt  time.Time `bson:"updatedAt"`
}

func newFromOrganization(o *organization.Organization) *mongoOrganization {
	return &mongoOrganization{
		id:         o.GetId(),
		logo:       o.GetLogo(),
		currency:   o.GetCurrency().String(),
		isDisabled: o.IsDisabled(),
		isDeleted:  o.IsDeleted(),
		createdAt:  o.GetCreatedAt(),
		updatedAt:  o.GetUpdatedAt(),
	}
}

func (m *mongoOrganization) ToAggregate() (*organization.Organization, error) {
	return organization.UnmarshalOrganizationFromDatabase(m.id, m.logo, m.currency, m.isDisabled, m.isDeleted, m.createdAt, m.updatedAt)
}

func (r *RepoOrganization) Find(ctx context.Context) ([]*organization.Organization, error) {
	cur, err := r.Coll().Find(ctx, bson.D{{}})
	if err != nil {
		return nil, err
	}
	defer cur.Close(nil)

	var organizations []*organization.Organization
	for cur.Next(nil) {
		var o mongoOrganization
		if err = cur.Decode(&o); err != nil {
			return nil, err
		}
		org, err := o.ToAggregate()
		if err != nil {
			return nil, err
		}
		organizations = append(organizations, org)
	}
	return organizations, nil
}

func (r *RepoOrganization) FindById(ctx context.Context, id base.UUID) (*organization.Organization, error) {
	var o mongoOrganization
	if err := r.Coll().FindOne(ctx, bson.D{{"_id", id}}).Decode(&o); err != nil {
		return nil, err
	}
	return o.ToAggregate()
}

func (r *RepoOrganization) Create(ctx context.Context, o *organization.Organization) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrganization(o))
	return err
}

func (r *RepoOrganization) UpdateOrganization(ctx context.Context, o *organization.Organization) error {
	_, err := r.Coll().UpdateOne(ctx, o.GetId(), newFromOrganization(o))
	return err
}

func (r *RepoOrganization) DeleteOrganization(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{{"_id", id}}, bson.M{"isDeleted": true})
	return err
}

func (r *RepoOrganization) DisableOrganization(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{{"_id", id}}, bson.M{"isDisabled": true})
	return err
}

func (r *RepoOrganization) EnableOrganization(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{{"_id", id}}, bson.M{"isDisabled": false})
	return err
}
