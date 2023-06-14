package activationLink

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
	Link        base.UUID `bson:"link"`
	UserId      base.UUID `bson:"userID"`
	IsActivated bool      `bson:"isActivated"`
}

func newFromActivationLink(a *activationLink.ActivationLink) *mongoActivationLink {
	return &mongoActivationLink{
		Link:        a.GetLink(),
		UserId:      a.GetUserId(),
		IsActivated: a.GetIsActivated(),
	}
}

func (m *mongoActivationLink) ToAggregate() *activationLink.ActivationLink {
	return activationLink.UnmarshalActivationLinkFromDatabase(m.Link, m.UserId, m.IsActivated)
}

func (r *RepoActivationLink) Find(ctx context.Context, userId base.UUID) ([]*activationLink.ActivationLink, error) {
	cur, err := r.Coll().Find(ctx, bson.M{"userID": userId})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var activationLinks []*activationLink.ActivationLink
	for cur.Next(ctx) {
		var internal mongoActivationLink
		if err = cur.Decode(&internal); err != nil {
			return nil, err
		}
		activationLinks = append(activationLinks, internal.ToAggregate())
	}
	return activationLinks, nil
}

func (r *RepoActivationLink) FindOneByUserId(ctx context.Context, userId base.UUID) (*activationLink.ActivationLink, error) {
	var foundActivationLink mongoActivationLink
	if err := r.Coll().FindOne(ctx, bson.M{"userID": userId}).Decode(&foundActivationLink); err != nil {
		return nil, err
	}
	return foundActivationLink.ToAggregate(), nil
}

func (r *RepoActivationLink) FindOneByLink(ctx context.Context, link base.UUID) (*activationLink.ActivationLink, error) {
	var foundActivationLink mongoActivationLink
	if err := r.Coll().FindOne(ctx, bson.M{"link": link}).Decode(&foundActivationLink); err != nil {
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
		"link": activationLink.GetLink(),
	}, bson.M{
		"$set": newFromActivationLink(activationLink),
	})
	return err
}

func (r *RepoActivationLink) DeleteAll(ctx context.Context, user base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{
		"userID": user,
	})
	return err
}

func (r *RepoActivationLink) DeleteOne(ctx context.Context, user base.UUID) error {
	_, err := r.Coll().DeleteMany(ctx, bson.M{
		"userID": user,
	})
	return err
}
