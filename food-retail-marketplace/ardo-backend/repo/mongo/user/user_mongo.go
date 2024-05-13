package user

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user/exceptions"
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

type mongoDeliveryPoint struct {
	Id              uuid.UUID `bson:"_id"`
	Address         string    `bson:"address"`
	Floor           string    `bson:"floor"`
	Apartment       string    `bson:"apartment"`
	DeliveryComment string    `bson:"deliveryComment"`
}

func newFromDeliveryInfo(d valueobject.DeliveryPoint) mongoDeliveryPoint {
	return mongoDeliveryPoint{
		Id:              d.GetId(),
		Address:         d.GetAddress(),
		Floor:           d.GetFloor(),
		Apartment:       d.GetApartment(),
		DeliveryComment: d.GetDeliveryComment(),
	}
}

func (m *mongoDeliveryPoint) ToAggregate() valueobject.DeliveryPoint {
	return valueobject.UnmarshalDeliveryPointFromDatabase(m.Id, m.Address, m.Floor, m.Apartment, m.DeliveryComment)
}

type mongoUser struct {
	Id        uuid.UUID `bson:"_id"`
	Code      string    `bson:"code"`
	FirstName string    `bson:"firstName"`
	LastName  string    `bson:"lastName"`
	Email     string    `bson:"email"`
	Phone     struct {
		Number      string `bson:"number"`
		CountryCode string `bson:"countryCode"`
	} `bson:"phone"`
	DeliveryPoints    []mongoDeliveryPoint `bson:"deliveryPoints"`
	LastDeliveryPoint mongoDeliveryPoint   `bson:"lastDeliveryPoint"`
	Password          mongoPassword        `bson:"password"`
	UserType          string               `bson:"userType"`
	PreferredLang     string               `bson:"preferredLang"`
	IsDeleted         bool                 `bson:"isDeleted"`
	CreatedAt         time.Time            `bson:"createdAt"`
	UpdatedAt         time.Time            `bson:"updatedAt"`
	Version           int                  `bson:"version"`
}

func newFromUser(u *user.User) *mongoUser {
	mongoDeliveryPoints := make([]mongoDeliveryPoint, 0, len(u.GetDeliveryPoints()))
	for _, d := range u.GetDeliveryPoints() {
		mongoDeliveryPoints = append(mongoDeliveryPoints, newFromDeliveryInfo(d))
	}
	userPhone := u.GetPhone()
	return &mongoUser{
		Id:        u.GetId(),
		Code:      u.GetCode().String(),
		FirstName: u.GetFirstName().String(),
		LastName:  u.GetLastName().String(),
		Email:     u.GetEmail().String(),
		Phone: struct {
			Number      string `bson:"number"`
			CountryCode string `bson:"countryCode"`
		}{
			Number:      userPhone.GetNumber(),
			CountryCode: userPhone.GetCountryCode(),
		},
		DeliveryPoints:    mongoDeliveryPoints,
		LastDeliveryPoint: newFromDeliveryInfo(u.GetLastDeliveryPoint()),
		Password:          newFromPassword(u.GetPassword()),
		UserType:          u.GetUserType().String(),
		PreferredLang:     u.GetUserPreferredLang().String(),
		IsDeleted:         u.GetIsDeleted(),
		CreatedAt:         u.GetCreatedAt(),
		UpdatedAt:         u.GetUpdatedAt(),
		Version:           u.GetVersion(),
	}
}

func (m *mongoUser) ToAggregate() *user.User {
	deliveryPoints := make([]valueobject.DeliveryPoint, 0, len(m.DeliveryPoints))
	for _, d := range m.DeliveryPoints {
		deliveryPoints = append(deliveryPoints, valueobject.UnmarshalDeliveryPointFromDatabase(d.Id, d.Address, d.Floor, d.Apartment, d.DeliveryComment))
	}
	return user.UnmarshalUserFromDatabase(m.Id, m.Code, m.FirstName, m.LastName, m.Email, m.Phone.Number, m.Phone.CountryCode, m.UserType, m.PreferredLang, deliveryPoints, valueobject.UnmarshalDeliveryPointFromDatabase(m.LastDeliveryPoint.Id, m.LastDeliveryPoint.Address, m.LastDeliveryPoint.Floor, m.LastDeliveryPoint.Apartment, m.LastDeliveryPoint.DeliveryComment), m.Password.ToAggregate(), m.IsDeleted, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoUser) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSort(bson.D{{"createdAt", -1}}).SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var users []*user.User
	for cur.Next(ctx) {
		var internal mongoUser
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		users = append(users, internal.ToAggregate())
	}
	return users, count, nil
}

func (r *RepoUser) FindOneById(ctx context.Context, id uuid.UUID) (*user.User, error) {
	var foundUser mongoUser
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&foundUser); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, exceptions.ErrUserNotFound
		}
		return nil, err
	}
	return foundUser.ToAggregate(), nil
}

func (r *RepoUser) FindOneByEmail(ctx context.Context, email string) (*user.User, error) {
	var foundUser mongoUser
	err := r.Coll().FindOne(ctx, bson.M{"email": email}).Decode(&foundUser)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, exceptions.ErrUserNotFound
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

func (r *RepoUser) Recover(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": false,
			"updatedAt": time.Now(),
		},
		"$inc": bson.D{
			{"version", 1},
		},
	})
	return err
}

func (r *RepoUser) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
		"$inc": bson.D{
			{"version", 1},
		},
	})
	return err
}
