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

type RepoUserOrganization struct {
	client *mongo.Client
}

func NewRepoOrganization(client *mongo.Client) *RepoUserOrganization {
	return &RepoUserOrganization{client: client}
}

func (r *RepoUserOrganization) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("user_organizations")
}

type mongoUserOrganization struct {
	Id        base.UUID `bson:"_id"`
	UserID    base.UUID `bson:"userID"`
	Role      string    `bson:"role"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

func newFromUserOrganization(o *user_organization.UserOrganization) *mongoUserOrganization {
	return &mongoUserOrganization{
		Id:        o.GetId(),
		UserID:    o.GetUserId(),
		Role:      o.GetRole().String(),
		CreatedAt: o.GetCreatedAt(),
		UpdatedAt: o.GetUpdatedAt(),
	}
}

func (m *mongoUserOrganization) ToAggregate() *user_organization.UserOrganization {
	return user_organization.UnmarshalUserOrganizationFromDatabase(m.Id, m.UserID, m.Role, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoUserOrganization) Find(ctx context.Context) ([]*user_organization.UserOrganization, error) {
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": false})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	defer cur.Close(ctx)

	var result []*user_organization.UserOrganization
	for cur.Next(ctx) {
		var internal mongoUserOrganization
		if err = cur.Decode(&internal); err != nil {
			return nil, err
		}
		result = append(result, internal.ToAggregate())
	}
	return result, nil
}

func (r *RepoUserOrganization) FindOneByOrgId(ctx context.Context, orgId base.UUID) (*user_organization.UserOrganization, error) {
	var org mongoUserOrganization
	err := r.Coll().FindOne(ctx, bson.M{"_id": orgId}).Decode(&org)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return org.ToAggregate(), nil
}

func (r *RepoUserOrganization) Create(ctx context.Context, organization *user_organization.UserOrganization) error {
	_, err := r.Coll().InsertOne(ctx, newFromUserOrganization(organization))
	return err
}

func (r *RepoUserOrganization) UpdateMerchantRole(ctx context.Context, orgId base.UUID, role valueobject.MerchantRole) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": orgId,
	}, bson.M{
		"$set": bson.M{
			"role": role.String(),
		},
	})
	return err
}

func (r *RepoUserOrganization) Delete(ctx context.Context, orgId base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": orgId,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
		},
	})
	return err
}
