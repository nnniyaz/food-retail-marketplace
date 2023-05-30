package user

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoUser struct {
	client    mongo.Client
	col       *mongo.Collection
	accessCol *mongo.Collection
}

func NewRepoUser(client mongo.Client) *RepoUser {
	return &RepoUser{client: client}
}

func (r *RepoUser) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("users")
}

func (r *RepoUser) Find(ctx context.Context) ([]*user.User, error) {
	var users []*user.User
	cur, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	err = cur.All(ctx, &users)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *RepoUser) FindOneById(ctx context.Context, id base.UUID) (*user.User, error) {
	var user user.User
	err := r.Coll().FindOne(ctx, bson.D{{"_id", id}}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *RepoUser) FindOneByEmail(ctx context.Context, email valueobject.Email) (*user.User, error) {
	var user user.User
	err := r.Coll().FindOne(ctx, bson.D{{"email", email}}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

type mongoPassword struct {
	hash string `bson:"hash"`
	salt string `bson:"salt"`
}

func newFromPassword(p valueobject.Password) mongoPassword {
	return mongoPassword{
		hash: p.GetHash(),
		salt: p.GetSalt(),
	}
}

type mongoUser struct {
	id        base.UUID     `bson:"_id"`
	firstName string        `bson:"first_name"`
	lastName  string        `bson:"last_name"`
	email     string        `bson:"email"`
	password  mongoPassword `bson:"password"`
	userType  string        `bson:"user_type"`
	isDeleted bool          `bson:"is_deleted"`
	createdAt time.Time     `bson:"created_at"`
	updatedAt time.Time     `bson:"updated_at"`
}

func newFromUser(u *user.User) *mongoUser {
	return &mongoUser{
		id:        u.GetId(),
		firstName: u.GetFirstName().String(),
		lastName:  u.GetLastName().String(),
		email:     u.GetEmail().String(),
		password:  newFromPassword(u.GetPassword()),
		userType:  u.GetUserType().String(),
		isDeleted: u.GetIsDeleted(),
		createdAt: u.GetCreatedAt(),
		updatedAt: u.GetUpdatedAt(),
	}
}

func (r *RepoUser) Create(ctx context.Context, user *user.User) error {
	_, err := r.Coll().InsertOne(ctx, newFromUser(user))
	return err
}

func (r *RepoUser) Update(ctx context.Context, user *user.User) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{{"_id", user.GetId()}}, bson.D{{"$set", newFromUser(user)}})
	return err
}

func (r *RepoUser) Delete(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{{"_id", id}}, bson.D{{"$set", bson.D{{"is_deleted", true}}}})
	return err
}
