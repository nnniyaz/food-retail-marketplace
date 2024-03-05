package slide

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/slide"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoSlide struct {
	client *mongo.Client
}

func NewRepoSlide(client *mongo.Client) *RepoSlide {
	return &RepoSlide{client: client}
}

func (r *RepoSlide) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("slides")
}

type mongoSlide struct {
	Id        uuid.UUID     `bson:"_id"`
	Caption   core.MlString `bson:"caption"`
	Img       string        `bson:"img"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Version   int           `bson:"version"`
}

func newFromSlide(s *slide.Slide) *mongoSlide {
	return &mongoSlide{
		Id:        s.GetId(),
		Caption:   s.GetCaption(),
		Img:       s.GetImg(),
		IsDeleted: s.GetIsDeleted(),
		CreatedAt: s.GetCreatedAt(),
		UpdatedAt: s.GetUpdatedAt(),
		Version:   s.GetVersion(),
	}
}

func (m *mongoSlide) ToAggregate() *slide.Slide {
	return slide.UnmarshalSlideFromDatabase(m.Id, m.Caption, m.Img, m.IsDeleted, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoSlide) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*slide.Slide, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var result []*slide.Slide
	for cur.Next(ctx) {
		var s mongoSlide
		err := cur.Decode(&s)
		if err != nil {
			return nil, 0, err
		}
		result = append(result, s.ToAggregate())
	}
	return result, count, nil
}

func (r *RepoSlide) FindById(ctx context.Context, id uuid.UUID) (*slide.Slide, error) {
	var s mongoSlide
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&s)
	if err != nil {
		return nil, err
	}
	return s.ToAggregate(), nil
}

func (r *RepoSlide) Create(ctx context.Context, s *slide.Slide) error {
	_, err := r.Coll().InsertOne(ctx, newFromSlide(s))
	return err
}

func (r *RepoSlide) Update(ctx context.Context, s *slide.Slide) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": s.GetId(),
	}, bson.M{
		"$set": newFromSlide(s),
	})
	return err
}

func (r *RepoSlide) Recover(ctx context.Context, id uuid.UUID) error {
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

func (r *RepoSlide) Delete(ctx context.Context, id uuid.UUID) error {
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
