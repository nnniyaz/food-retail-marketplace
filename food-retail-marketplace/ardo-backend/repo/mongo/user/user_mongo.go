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

type mongoPassword struct {
	Hash string `bson:"hash"`
	Salt string `bson:"salt"`
}

func newFromPassword(p valueobject.Password) mongoPassword {
	return mongoPassword{
		Hash: p.GetHash(),
		Salt: p.GetSalt(),
	}
}

func (m *mongoPassword) ToAggregate() valueobject.Password {
	return valueobject.UnmarshalPasswordFromDatabase(m.Hash, m.Salt)
}

type mongoUser struct {
	Id        base.UUID     `bson:"_id"`
	FirstName string        `bson:"first_name"`
	LastName  string        `bson:"last_name"`
	Email     string        `bson:"email"`
	Password  mongoPassword `bson:"password"`
	UserType  string        `bson:"user_type"`
	IsDeleted bool          `bson:"is_deleted"`
	CreatedAt time.Time     `bson:"created_at"`
	UpdatedAt time.Time     `bson:"updated_at"`
}

func newFromUser(u *user.User) *mongoUser {
	return &mongoUser{
		Id:        u.GetId(),
		FirstName: u.GetFirstName().String(),
		LastName:  u.GetLastName().String(),
		Email:     u.GetEmail().String(),
		Password:  newFromPassword(u.GetPassword()),
		UserType:  u.GetUserType().String(),
		IsDeleted: u.GetIsDeleted(),
		CreatedAt: u.GetCreatedAt(),
		UpdatedAt: u.GetUpdatedAt(),
	}
}

func (m *mongoUser) ToAggregate() *user.User {
	return user.UnmarshalUserFromDatabase(m.Id, m.FirstName, m.LastName, m.Email, m.UserType, m.Password.ToAggregate(), m.IsDeleted, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoUser) Find(ctx context.Context) ([]*user.User, error) {
	cur, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	var result []*user.User
	for cur.Next(ctx) {
		var internal mongoUser
		if err = cur.Decode(&internal); err != nil {
			return nil, err
		}
		result = append(result, internal.ToAggregate())
	}
	return result, nil
}

func (r *RepoUser) FindOneById(ctx context.Context, id base.UUID) (*user.User, error) {
	var foundUser mongoUser
	err := r.Coll().FindOne(ctx, bson.D{{"_id", id}}).Decode(&foundUser)
	if err != nil {
		return nil, err
	}
	return foundUser.ToAggregate(), nil
}

func (r *RepoUser) FindOneByEmail(ctx context.Context, email string) (*user.User, error) {
	var foundUser mongoUser
	err := r.Coll().FindOne(ctx, bson.D{{"email", email}}).Decode(&foundUser)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return foundUser.ToAggregate(), nil
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
