package product

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoProduct struct {
	client *mongo.Client
}

func NewRepoProduct(client *mongo.Client) *RepoProduct {
	return &RepoProduct{client: client}
}

func (r *RepoProduct) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("products")
}

type mongoProduct struct {
	Id        uuid.UUID     `bson:"_id"`
	Name      core.MlString `bson:"name"`
	Desc      core.MlString `bson:"desc"`
	Price     float64       `bson:"price"`
	Quantity  int           `bson:"quantity"`
	Img       string        `bson:"img"`
	Status    string        `bson:"status"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
}

func newFromProduct(p *product.Product) *mongoProduct {
	return &mongoProduct{
		Id:        p.GetId(),
		Name:      p.GetName(),
		Desc:      p.GetDesc(),
		Price:     p.GetPrice(),
		Quantity:  p.GetQuantity(),
		Img:       p.GetImg(),
		Status:    p.GetStatus().String(),
		IsDeleted: p.GetIsDeleted(),
		CreatedAt: p.GetCreatedAt(),
		UpdatedAt: p.GetUpdatedAt(),
	}
}

func (m *mongoProduct) ToAggregate() (*product.Product, error) {
	return product.UnmarshalProductFromDatabase(m.Id, m.Name, m.Desc, m.Price, m.Quantity, m.Img, m.Status, m.IsDeleted, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoProduct) FindByFilters(ctx context.Context, limit, offset int64, isDeleted bool) ([]*product.Product, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cursor, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(nil)

	var products []*product.Product
	for cursor.Next(nil) {
		var mp mongoProduct
		if err := cursor.Decode(&mp); err != nil {
			return nil, 0, err
		}
		p, err := mp.ToAggregate()
		if err != nil {
			return nil, 0, err
		}
		products = append(products, p)
	}

	return products, count, nil
}

func (r *RepoProduct) FindOneById(ctx context.Context, id uuid.UUID) (*product.Product, error) {
	var mp mongoProduct
	if err := r.Coll().FindOne(ctx, bson.M{
		"_id": id,
	}).Decode(&mp); err != nil {
		return nil, err
	}
	return mp.ToAggregate()
}

func (r *RepoProduct) Create(ctx context.Context, p *product.Product) error {
	_, err := r.Coll().InsertOne(ctx, newFromProduct(p))
	return err
}

func (r *RepoProduct) Update(ctx context.Context, p *product.Product) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": p.GetId(),
	}, bson.M{
		"$set": newFromProduct(p),
	})
	return err
}

func (r *RepoProduct) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"isDeleted": true}})
	return err
}

func (r *RepoProduct) Recover(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"isDeleted": false}})
	return err
}
