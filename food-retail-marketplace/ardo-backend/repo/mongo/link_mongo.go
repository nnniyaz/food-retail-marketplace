package mongo

import (
	"context"
	"errors"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoLink struct {
	client mongo.Client
}

func NewRepoLink(client mongo.Client) *RepoLink {
	return &RepoLink{client: client}
}

func (r *RepoLink) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("activationLinks")
}

func (r *RepoLink) CreateActivationLink(ctx context.Context, activationLink domain.ActivationLink) error {
	_, err := r.Coll().InsertOne(ctx, activationLink)
	if err != nil {
		return err
	}
	return nil
}

func (r *RepoLink) UpdateActivationLinkIsActivated(ctx context.Context, link uuid.UUID) error {
	filter := bson.D{{"link", link}}
	update := bson.D{{"$set", bson.D{{"isActivated", true}}}}
	_, err := r.Coll().UpdateOne(ctx, filter, update)
	return err
}

func (r *RepoLink) GetActivationLink(ctx context.Context, link uuid.UUID) (domain.ActivationLink, error) {
	var activationLink domain.ActivationLink
	err := r.Coll().FindOne(ctx, domain.ActivationLink{Link: link}).Decode(&activationLink)
	if err != nil {
		return domain.ActivationLink{}, err
	}
	return activationLink, nil
}

func (r *RepoLink) GetAllActivationLinks(ctx context.Context, user uuid.UUID) ([]domain.ActivationLink, error) {
	var activationLinks []domain.ActivationLink
	cur, err := r.Coll().Find(ctx, domain.ActivationLink{UserId: user})
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return []domain.ActivationLink{}, nil
		}
		return []domain.ActivationLink{}, err
	}

	if err = cur.All(ctx, &activationLinks); err != nil {
		return []domain.ActivationLink{}, err
	}

	return activationLinks, nil
}

func (r *RepoLink) DeleteActivationLink(ctx context.Context, user uuid.UUID, link uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, domain.ActivationLink{UserId: user, Link: link})
	return err
}

func (r *RepoLink) DeleteAllActivationLinks(ctx context.Context, user uuid.UUID) error {
	_, err := r.Coll().DeleteMany(ctx, domain.ActivationLink{UserId: user})
	return err
}
