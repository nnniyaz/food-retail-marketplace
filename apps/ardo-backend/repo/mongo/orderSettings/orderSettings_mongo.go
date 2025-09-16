package orderSettings

import (
	"context"
	"github/nnniyaz/ardo/domain/orderSettings"
	"github/nnniyaz/ardo/domain/orderSettings/valueobject"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoOrderSettings struct {
	client *mongo.Client
}

func NewRepoOrderSettings(client *mongo.Client) *RepoOrderSettings {
	return &RepoOrderSettings{client: client}
}

func (r *RepoOrderSettings) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("orderSettings")
}

type mongoOrderSettings struct {
	Moq struct {
		Fee      int64 `bson:"fee"`
		FreeFrom int64 `bson:"freeFrom"`
	} `bson:"moq"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
	Version   int       `bson:"version"`
}

func newFromOrderSettings(os *orderSettings.OrderSettings) *mongoOrderSettings {
	moq := os.GetMoq()
	return &mongoOrderSettings{
		Moq: struct {
			Fee      int64 `bson:"fee"`
			FreeFrom int64 `bson:"freeFrom"`
		}{
			Fee:      moq.GetFee(),
			FreeFrom: moq.GetFreeFrom(),
		},
		CreatedAt: os.GetCreatedAt(),
		UpdatedAt: os.GetUpdatedAt(),
		Version:   os.GetVersion(),
	}
}

func (m *mongoOrderSettings) ToAggregate() *orderSettings.OrderSettings {
	return orderSettings.UnmarshalOrderSettingsFromDatabase(valueobject.UnmarshalMoqFromDatabase(m.Moq.Fee, m.Moq.FreeFrom), m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoOrderSettings) GetOrderSettings(ctx context.Context) (*orderSettings.OrderSettings, error) {
	cur, err := r.Coll().Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var result []*orderSettings.OrderSettings
	for cur.Next(ctx) {
		var internal mongoOrderSettings
		if err = cur.Decode(&internal); err != nil {
			return nil, err
		}
		result = append(result, internal.ToAggregate())
		break
	}
	return result[0], nil
}

func (r *RepoOrderSettings) UpdateMoqFee(ctx context.Context, orderSettings *orderSettings.OrderSettings) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"moq": bson.M{"$exists": true},
	}, bson.M{
		"$set": newFromOrderSettings(orderSettings),
	})
	return err
}
