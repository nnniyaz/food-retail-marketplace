package category

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoCategory struct {
	client *mongo.Client
}

func NewRepoCategory(client *mongo.Client) *RepoCategory {
	return &RepoCategory{client: client}
}

func (r *RepoCategory) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("categories")
}

type mongoCategory struct {
	Id        uuid.UUID     `bson:"_id"`
	Name      core.MlString `bson:"name"`
	Desc      core.MlString `bson:"desc"`
	Img       string        `bson:"img"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Version   int           `bson:"version"`
}

func newFromCategory(c *category.Category) *mongoCategory {
	return &mongoCategory{
		Id:        c.GetId(),
		Name:      c.GetName(),
		Desc:      c.GetDesc(),
		Img:       c.GetImg(),
		IsDeleted: c.GetIsDeleted(),
		CreatedAt: c.GetCreatedAt(),
		UpdatedAt: c.GetUpdatedAt(),
		Version:   c.GetVersion(),
	}
}

func (m *mongoCategory) ToAggregate() *category.Category {
	return category.UnmarshalCategoryFromDatabase(m.Id, m.Name, m.Desc, m.Img, m.IsDeleted, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoCategory) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*category.Category, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSort(bson.D{{"createdAt", -1}}).SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var categories []*category.Category
	for cur.Next(ctx) {
		var internal mongoCategory
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		categories = append(categories, internal.ToAggregate())
	}
	return categories, count, nil
}

func (r *RepoCategory) FindOneById(ctx context.Context, id uuid.UUID) (*category.Category, error) {
	var foundCategory mongoCategory
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&foundCategory); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return foundCategory.ToAggregate(), nil
}

func (r *RepoCategory) Create(ctx context.Context, c *category.Category) error {
	_, err := r.Coll().InsertOne(ctx, newFromCategory(c))
	return err
}

func (r *RepoCategory) Update(ctx context.Context, c *category.Category) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": c.GetId(),
	}, bson.M{
		"$set": newFromCategory(c),
	})
	return err
}

func (r *RepoCategory) Recover(ctx context.Context, id uuid.UUID) error {
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

func (r *RepoCategory) Delete(ctx context.Context, id uuid.UUID) error {
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
