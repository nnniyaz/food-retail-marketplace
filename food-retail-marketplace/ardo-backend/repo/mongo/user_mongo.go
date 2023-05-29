package mongo

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoUser struct {
	client mongo.Client
}

func NewRepoUser(client mongo.Client) *RepoUser {
	return &RepoUser{client: client}
}

func (r *RepoUser) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("users")
}

func (r *RepoUser) GetUser(ctx context.Context, email base.Email) (*domain.User, error) {
	var user domain.User
	err := r.Coll().FindOne(ctx, bson.D{{"email", email}}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *RepoUser) CreateUser(ctx context.Context, user domain.User) error {
	_, err := r.Coll().InsertOne(ctx, user)
	return err
}
