package section

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoSection struct {
	client *mongo.Client
}

func NewRepoSection(client *mongo.Client) *RepoSection {
	return &RepoSection{client: client}
}

func (r *RepoSection) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("sections")
}

type mongoSection struct {
	Id        uuid.UUID     `bson:"_id"`
	Name      core.MlString `bson:"name"`
	Img       string        `bson:"img"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Version   int           `bson:"version"`
}

func newFromSection(s *section.Section) *mongoSection {
	return &mongoSection{
		Id:        s.GetId(),
		Name:      s.GetName(),
		Img:       s.GetImg(),
		IsDeleted: s.GetIsDeleted(),
		CreatedAt: s.GetCreatedAt(),
		UpdatedAt: s.GetUpdatedAt(),
		Version:   s.GetVersion(),
	}
}

func (m *mongoSection) ToAggregate() *section.Section {
	return section.UnmarshalSectionFromDatabase(m.Id, m.Name, m.Img, m.IsDeleted, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoSection) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool, search string) ([]*section.Section, int64, error) {
	filter := bson.D{
		{"isDeleted", isDeleted},
	}
	if search != "" {
		filter = append(filter, bson.E{
			Key:   "name.EN",
			Value: bson.D{{"$regex", primitive.Regex{Pattern: search, Options: "i"}}},
		})
	}

	count, err := r.Coll().CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, filter, options.Find().SetSort(bson.D{{"createdAt", -1}}).SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var sections []*section.Section
	for cur.Next(ctx) {
		var m mongoSection
		err := cur.Decode(&m)
		if err != nil {
			return nil, 0, err
		}
		sections = append(sections, m.ToAggregate())
	}
	return sections, count, nil
}

func (r *RepoSection) FindOneById(ctx context.Context, id uuid.UUID) (*section.Section, error) {
	var m mongoSection
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&m)
	if err != nil {
		return nil, err
	}
	return m.ToAggregate(), nil
}

func (r *RepoSection) Create(ctx context.Context, s *section.Section) error {
	_, err := r.Coll().InsertOne(ctx, newFromSection(s))
	return err
}

func (r *RepoSection) Update(ctx context.Context, s *section.Section) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": s.GetId(),
	}, bson.M{
		"$set": newFromSection(s),
	})
	return err
}

func (r *RepoSection) Recover(ctx context.Context, id uuid.UUID) error {
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

func (r *RepoSection) Delete(ctx context.Context, id uuid.UUID) error {
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
