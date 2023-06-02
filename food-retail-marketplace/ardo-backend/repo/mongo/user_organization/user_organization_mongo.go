package user_organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
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
	Id        base.UUID `bson:"_id"`
	UserID    base.UUID `bson:"userID"`
	Role      string    `bson:"role"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

func newFromOrganization(o *user_organization.UserOrganization) *mongoOrganization {
	return &mongoOrganization{
		Id:        o.GetId(),
		UserID:    o.GetUserId(),
		Role:      o.GetRole().String(),
		CreatedAt: o.GetCreatedAt(),
		UpdatedAt: o.GetUpdatedAt(),
	}
}

func (m *mongoOrganization) ToAggregate() *user_organization.UserOrganization {
	return user_organization.UnmarshalUserOrganizationFromDatabase(m.Id, m.UserID, m.Role, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoOrganization) Find(ctx context.Context) ([]*user_organization.UserOrganization, error) {
	cur, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	defer cur.Close(ctx)

	var result []*user_organization.UserOrganization
	for cur.Next(ctx) {
		var internal mongoOrganization
		if err = cur.Decode(&internal); err != nil {
			return nil, err
		}
		result = append(result, internal.ToAggregate())
	}
	return result, nil
}

func (r *RepoOrganization) FindOneByOrgId(ctx context.Context, orgId base.UUID) (*user_organization.UserOrganization, error) {
	var org mongoOrganization
	err := r.Coll().FindOne(ctx, bson.D{{"_id", orgId}}).Decode(&org)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return org.ToAggregate(), nil
}

func (r *RepoOrganization) Create(ctx context.Context, organization *user_organization.UserOrganization) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrganization(organization))
	return err
}

func (r *RepoOrganization) UpdateMerchantRole(ctx context.Context, orgId base.UUID, role valueobject.MerchantRole) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{
		{"_id", orgId},
	}, bson.D{{"$set", bson.D{
		{"role", role.String()},
	}}})
	return err
}

func (r *RepoOrganization) Delete(ctx context.Context, orgId base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{
		{"_id", orgId},
	}, bson.D{{"$set", bson.D{
		{"isDeleted", true},
	}}})
	return err
}
