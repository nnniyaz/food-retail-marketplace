package product

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/product/exceptions"
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
	Quantity  int64         `bson:"quantity"`
	Img       string        `bson:"img"`
	Status    string        `bson:"status"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Version   int           `bson:"version"`
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
		Version:   p.GetVersion(),
	}
}

func (m *mongoProduct) ToAggregate() *product.Product {
	return product.UnmarshalProductFromDatabase(m.Id, m.Name, m.Desc, m.Price, m.Quantity, m.Img, m.Status, m.IsDeleted, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoProduct) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var products []*product.Product
	for cur.Next(ctx) {
		var internal mongoProduct
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		products = append(products, internal.ToAggregate())
	}
	return products, count, nil
}

func (r *RepoProduct) FindOneById(ctx context.Context, id uuid.UUID) (*product.Product, error) {
	var foundProduct mongoProduct
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&foundProduct); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, exceptions.ErrProductNotFound
		}
		return nil, err
	}
	return foundProduct.ToAggregate(), nil
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
