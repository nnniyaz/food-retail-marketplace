package user

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoUser struct {
	client    *mongo.Client
	col       *mongo.Collection
	accessCol *mongo.Collection
}

func NewRepoUser(client *mongo.Client) *RepoUser {
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
	FirstName string        `bson:"firstName"`
	LastName  string        `bson:"lastName"`
	Email     string        `bson:"email"`
	Password  mongoPassword `bson:"password"`
	UserType  string        `bson:"userType"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
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
	cur, err := r.Coll().Find(ctx, bson.M{
		"isDeleted": false,
	})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

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

func (r *RepoUser) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, error) {
	filter := bson.M{"isDeleted": isDeleted}

	cur, err := r.Coll().Find(ctx, filter, options.Find().SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

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
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&foundUser)
	if err != nil {
		return nil, err
	}
	return foundUser.ToAggregate(), nil
}

func (r *RepoUser) FindOneByEmail(ctx context.Context, email string) (*user.User, error) {
	var foundUser mongoUser
	err := r.Coll().FindOne(ctx, bson.M{"email": email}).Decode(&foundUser)
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
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": user.GetId(),
	}, bson.M{
		"$set": newFromUser(user),
	})
	return err
}

func (r *RepoUser) Delete(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
	})
	return err
}
