package user_organization

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoUserOrganization struct {
	client *mongo.Client
}

func NewRepoUserOrganization(client *mongo.Client) *RepoUserOrganization {
	return &RepoUserOrganization{client: client}
}

func (r *RepoUserOrganization) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("user_organizations")
}

type mongoUserOrganization struct {
	Id        uuid.UUID `bson:"_id"`
	OrgId     uuid.UUID `bson:"orgId"`
	UserID    uuid.UUID `bson:"userId"`
	Role      string    `bson:"role"`
	IsDeleted bool      `bson:"isDeleted"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

func newFromUserOrganization(o *user_organization.UserOrganization) *mongoUserOrganization {
	return &mongoUserOrganization{
		Id:        o.GetId(),
		OrgId:     o.GetOrgId(),
		UserID:    o.GetUserId(),
		Role:      o.GetRole().String(),
		IsDeleted: o.GetIsDeleted(),
		CreatedAt: o.GetCreatedAt(),
		UpdatedAt: o.GetUpdatedAt(),
	}
}

func (m *mongoUserOrganization) ToAggregate() *user_organization.UserOrganization {
	return user_organization.UnmarshalUserOrganizationFromDatabase(m.Id, m.OrgId, m.UserID, m.Role, m.IsDeleted, m.CreatedAt, m.UpdatedAt)
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

func (r *RepoUserOrganization) FindOneByUserIdAndOrgId(ctx context.Context, userId, orgId uuid.UUID, isDeleted bool) (*user_organization.UserOrganization, error) {
	var org mongoUserOrganization
	err := r.Coll().FindOne(ctx, bson.M{"userId": userId, "orgId": orgId, "isDeleted": isDeleted}).Decode(&org)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return org.ToAggregate(), nil
}

func (r *RepoUserOrganization) FindUsersByOrgId(ctx context.Context, orgId uuid.UUID, offset, limit int64, isDeleted bool) ([]*user_organization.UserOrganization, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"orgId": orgId, "isDeleted": isDeleted}, options.Find().SetSkip(offset).SetLimit(limit))
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, 0, nil
		}
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var result []*user_organization.UserOrganization
	for cur.Next(ctx) {
		var internal mongoUserOrganization
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		result = append(result, internal.ToAggregate())
	}
	return result, count, nil
}

func (r *RepoUserOrganization) Create(ctx context.Context, organization *user_organization.UserOrganization) error {
	_, err := r.Coll().InsertOne(ctx, newFromUserOrganization(organization))
	return err
}

func (r *RepoUserOrganization) UpdateMerchantRole(ctx context.Context, orgId, userId uuid.UUID, role valueobject.MerchantRole) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"orgId":  orgId,
		"userId": userId,
	}, bson.M{
		"$set": bson.M{
			"role":      role.String(),
			"updatedAt": time.Now(),
		},
	})
	return err
}

func (r *RepoUserOrganization) DeleteOrg(ctx context.Context, orgId uuid.UUID) error {
	_, err := r.Coll().UpdateMany(ctx, bson.M{
		"orgId": orgId,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
	})
	return err
}

func (r *RepoUserOrganization) DeleteUserFromAllOrgs(ctx context.Context, userId uuid.UUID) error {
	_, err := r.Coll().UpdateMany(ctx, bson.M{
		"userId": userId,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
	})
	return err
}

func (r *RepoUserOrganization) DeleteUserFromOrg(ctx context.Context, orgId, userId uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"orgId":  orgId,
		"userId": userId,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
	})
	return err
}
