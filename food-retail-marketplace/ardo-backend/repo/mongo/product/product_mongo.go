package product

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/product"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
	Id         base.UUID `bson:"_id"`
	OrgId      base.UUID `bson:"orgId"`
	SectionId  base.UUID `bson:"sectionId"`
	CategoryId base.UUID `bson:"categoryId"`
	Price      float64   `bson:"price"`
	Quantity   int       `bson:"quantity"`
	Status     string    `bson:"status"`
	IsDeleted  bool      `bson:"isDeleted"`
	CreatedAt  time.Time `bson:"createdAt"`
	UpdatedAt  time.Time `bson:"updatedAt"`
}

func newFromProduct(p *product.Product) *mongoProduct {
	return &mongoProduct{
		Id:         p.GetId(),
		OrgId:      p.GetOrgId(),
		SectionId:  p.GetSectionId(),
		CategoryId: p.GetCategoryId(),
		Price:      p.GetPrice(),
		Quantity:   p.GetQuantity(),
		Status:     p.GetStatus().String(),
		IsDeleted:  p.IsDeleted(),
		CreatedAt:  p.GetCreatedAt(),
		UpdatedAt:  p.GetUpdatedAt(),
	}
}

func (m *mongoProduct) ToAggregate() (*product.Product, error) {
	return product.UnmarshalProductFromDatabase(m.Id, m.OrgId, m.SectionId, m.CategoryId, m.Price, m.Quantity, m.Status, m.IsDeleted, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoProduct) Find(ctx context.Context) ([]*product.Product, error) {
	cursor, err := r.Coll().Find(ctx, bson.M{
		"isDeleted": false,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(nil)

	var products []*product.Product
	for cursor.Next(nil) {
		var mp mongoProduct
		if err := cursor.Decode(&mp); err != nil {
			return nil, err
		}
		p, err := mp.ToAggregate()
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	return products, nil
}

func (r *RepoProduct) FindById(ctx context.Context, id base.UUID) (*product.Product, error) {
	var mp mongoProduct
	if err := r.Coll().FindOne(ctx, bson.M{
		"_id": id,
	}).Decode(&mp); err != nil {
		return nil, err
	}
	return mp.ToAggregate()
}

func (r *RepoProduct) FindByOrgId(ctx context.Context, orgId base.UUID) ([]*product.Product, error) {
	cursor, err := r.Coll().Find(ctx, bson.M{
		"orgId":     orgId,
		"isDeleted": false,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(nil)

	var products []*product.Product
	for cursor.Next(nil) {
		var mp mongoProduct
		if err := cursor.Decode(&mp); err != nil {
			return nil, err
		}
		p, err := mp.ToAggregate()
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	return products, nil
}

func (r *RepoProduct) FindBySectionId(ctx context.Context, sectionId base.UUID) ([]*product.Product, error) {
	cursor, err := r.Coll().Find(ctx, bson.M{
		"sectionId": sectionId,
		"isDeleted": false,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(nil)

	var products []*product.Product
	for cursor.Next(nil) {
		var mp mongoProduct
		if err := cursor.Decode(&mp); err != nil {
			return nil, err
		}
		p, err := mp.ToAggregate()
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	return products, nil
}

func (r *RepoProduct) FindByCategoryId(ctx context.Context, categoryId base.UUID) ([]*product.Product, error) {
	cursor, err := r.Coll().Find(ctx, bson.M{
		"categoryId": categoryId,
		"isDeleted":  false,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(nil)

	var products []*product.Product
	for cursor.Next(nil) {
		var mp mongoProduct
		if err := cursor.Decode(&mp); err != nil {
			return nil, err
		}
		p, err := mp.ToAggregate()
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	return products, nil
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

func (r *RepoProduct) Delete(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}
