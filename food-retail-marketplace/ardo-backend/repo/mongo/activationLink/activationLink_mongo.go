package activationLink

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoActivationLink struct {
	client mongo.Client
}

func NewRepoActivationLink(client mongo.Client) *RepoActivationLink {
	return &RepoActivationLink{client: client}
}

func (r *RepoActivationLink) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("activationLinks")
}

func (r *RepoActivationLink) Find(ctx context.Context, userId base.UUID) ([]*activationLink.ActivationLink, error) {
	cur, err := r.Coll().Find(ctx, bson.D{{"userID", userId}})
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}

	var activationLinks []*activationLink.ActivationLink
	if err = cur.All(ctx, &activationLinks); err != nil {
		return nil, err
	}
	return activationLinks, nil
}

func (r *RepoActivationLink) FindOneByUserId(ctx context.Context, userId base.UUID) (*activationLink.ActivationLink, error) {
	var foundActivationLink *activationLink.ActivationLink
	if err := r.Coll().FindOne(ctx, bson.D{{"userID", userId}}).Decode(&foundActivationLink); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return foundActivationLink, nil
}

func (r *RepoActivationLink) FindOneByLink(ctx context.Context, link base.UUID) (*activationLink.ActivationLink, error) {
	var foundActivationLink *activationLink.ActivationLink
	if err := r.Coll().FindOne(ctx, bson.D{{"link", link}}).Decode(&foundActivationLink); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return foundActivationLink, nil
}

type mongoActivationLink struct {
	link        base.UUID `bson:"link"`
	userId      base.UUID `bson:"userID"`
	isActivated bool      `bson:"isActivated"`
}

func newFromActivationLink(a *activationLink.ActivationLink) *mongoActivationLink {
	return &mongoActivationLink{
		link:        a.GetLink(),
		userId:      a.GetUserId(),
		isActivated: a.GetIsActivated(),
	}
}

func (r *RepoActivationLink) Create(ctx context.Context, activationLink *activationLink.ActivationLink) error {
	_, err := r.Coll().InsertOne(ctx, newFromActivationLink(activationLink))
	if err != nil {
		return err
	}
	return nil
}

func (r *RepoActivationLink) Update(ctx context.Context, activationLink *activationLink.ActivationLink) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{
		{"link", activationLink.GetUserId()},
	}, bson.D{{"$set", newFromActivationLink(activationLink)}})
	return err
}

func (r *RepoActivationLink) DeleteAll(ctx context.Context, user base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.D{{"userID", user}})
	return err
}

func (r *RepoActivationLink) DeleteOne(ctx context.Context, user base.UUID) error {
	_, err := r.Coll().DeleteMany(ctx, bson.D{{"userID", user}})
	return err
}
