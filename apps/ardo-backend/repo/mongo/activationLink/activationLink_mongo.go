package activationLink

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoActivationLink struct {
	client *mongo.Client
}

func NewRepoActivationLink(client *mongo.Client) *RepoActivationLink {
	return &RepoActivationLink{client: client}
}

func (r *RepoActivationLink) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("activationLinks")
}

type mongoActivationLink struct {
	LinkId      uuid.UUID `bson:"linkId"`
	UserId      uuid.UUID `bson:"userId"`
	IsActivated bool      `bson:"isActivated"`
	CreatedAt   time.Time `bson:"createdAt"`
	UpdatedAt   time.Time `bson:"updatedAt"`
}

func newFromActivationLink(a *activationLink.ActivationLink) *mongoActivationLink {
	return &mongoActivationLink{
		LinkId:      a.GetLinkId(),
		UserId:      a.GetUserId(),
		IsActivated: a.GetIsActivated(),
		CreatedAt:   a.GetCreatedAt(),
		UpdatedAt:   a.GetUpdatedAt(),
	}
}

func (m *mongoActivationLink) ToAggregate() *activationLink.ActivationLink {
	return activationLink.UnmarshalActivationLinkFromDatabase(m.LinkId, m.UserId, m.IsActivated, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoActivationLink) FindOneByUserId(ctx context.Context, userId uuid.UUID) (*activationLink.ActivationLink, error) {
	var foundActivationLink mongoActivationLink
	if err := r.Coll().FindOne(ctx, bson.M{"userId": userId}).Decode(&foundActivationLink); err != nil {
		return nil, err
	}
	return foundActivationLink.ToAggregate(), nil
}

func (r *RepoActivationLink) FindOneByLinkId(ctx context.Context, linkId uuid.UUID) (*activationLink.ActivationLink, error) {
	var foundActivationLink mongoActivationLink
	if err := r.Coll().FindOne(ctx, bson.M{"linkId": linkId}).Decode(&foundActivationLink); err != nil {
		return nil, err
	}
	return foundActivationLink.ToAggregate(), nil
}

func (r *RepoActivationLink) Create(ctx context.Context, activationLink *activationLink.ActivationLink) error {
	_, err := r.Coll().InsertOne(ctx, newFromActivationLink(activationLink))
	if err != nil {
		return err
	}
	return nil
}

func (r *RepoActivationLink) Update(ctx context.Context, activationLink *activationLink.ActivationLink) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"userId": activationLink.GetUserId(),
	}, bson.M{
		"$set": newFromActivationLink(activationLink),
	})
	return err
}
