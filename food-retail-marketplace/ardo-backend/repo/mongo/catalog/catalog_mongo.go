package catalog

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoCatalog struct {
	client *mongo.Client
}

func NewRepoCatalog(client *mongo.Client) *RepoCatalog {
	return &RepoCatalog{client: client}
}

func (r *RepoCatalog) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("catalog")
}

func (r *RepoCatalog) CollPublishedCatalog() *mongo.Collection {
	return r.client.Database("main").Collection("publishedCatalogs")
}

type mongoCatalogsProduct struct {
	ProductId uuid.UUID `bson:"productId"`
}

func newFromCatalogsProduct(catalogsProduct valueObject.CatalogsProduct) mongoCatalogsProduct {
	return mongoCatalogsProduct{
		ProductId: catalogsProduct.GetId(),
	}
}

func (m *mongoCatalogsProduct) ToAggregate() valueObject.CatalogsProduct {
	return valueObject.UnmarshalCatalogsProductFromDatabase(m.ProductId)
}

type mongoCatalogsCategory struct {
	CategoryId uuid.UUID              `bson:"categoryId"`
	Products   []mongoCatalogsProduct `bson:"products"`
}

func newFromCatalogsCategory(catalogsCategory valueObject.CatalogsCategory) mongoCatalogsCategory {
	products := make([]mongoCatalogsProduct, len(catalogsCategory.GetProducts()))
	for i, product := range catalogsCategory.GetProducts() {
		products[i] = newFromCatalogsProduct(product)
	}
	return mongoCatalogsCategory{
		CategoryId: catalogsCategory.GetId(),
		Products:   products,
	}
}

func (m *mongoCatalogsCategory) ToAggregate() valueObject.CatalogsCategory {
	products := make([]valueObject.CatalogsProduct, len(m.Products))
	for i, product := range m.Products {
		products[i] = product.ToAggregate()
	}
	return valueObject.UnmarshalCatalogsCategoryFromDatabase(m.CategoryId, products)
}

type mongoCatalogsSection struct {
	SectionId  uuid.UUID               `bson:"sectionId"`
	Categories []mongoCatalogsCategory `bson:"categories"`
}

func newFromCatalogsSection(catalogsSection valueObject.CatalogsSection) mongoCatalogsSection {
	categories := make([]mongoCatalogsCategory, len(catalogsSection.GetCategories()))
	for i, category := range catalogsSection.GetCategories() {
		categories[i] = newFromCatalogsCategory(category)
	}
	return mongoCatalogsSection{
		SectionId:  catalogsSection.GetId(),
		Categories: categories,
	}
}

func (m *mongoCatalogsSection) ToAggregate() valueObject.CatalogsSection {
	categories := make([]valueObject.CatalogsCategory, len(m.Categories))
	for i, category := range m.Categories {
		categories[i] = category.ToAggregate()
	}
	return valueObject.UnmarshalCatalogsSectionFromDatabase(m.SectionId, categories)
}

type mongoCatalog struct {
	Id        uuid.UUID              `bson:"_id"`
	Structure []mongoCatalogsSection `bson:"structure"`
	CreatedAt time.Time              `bson:"createdAt"`
	UpdatedAt time.Time              `bson:"updatedAt"`
	Version   int                    `bson:"version"`
}

func newFromCatalog(c *catalog.Catalog) *mongoCatalog {
	structure := make([]mongoCatalogsSection, len(c.GetStructure()))
	for i, section := range c.GetStructure() {
		structure[i] = newFromCatalogsSection(section)
	}
	return &mongoCatalog{
		Id:        c.GetId(),
		Structure: structure,
		CreatedAt: c.GetCreatedAt(),
		UpdatedAt: c.GetUpdatedAt(),
		Version:   c.GetVersion(),
	}
}

func (m *mongoCatalog) ToAggregate() *catalog.Catalog {
	structure := make([]valueObject.CatalogsSection, len(m.Structure))
	for i, section := range m.Structure {
		structure[i] = section.ToAggregate()
	}
	return catalog.UnmarshalCatalogFromDatabase(m.Id, structure, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoCatalog) FindAll(ctx context.Context) ([]*catalog.Catalog, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{})
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var catalogs []*catalog.Catalog
	for cur.Next(ctx) {
		var internal mongoCatalog
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		catalogs = append(catalogs, internal.ToAggregate())
	}
	return catalogs, count, nil
}

func (r *RepoCatalog) FindOneById(ctx context.Context, id uuid.UUID) (*catalog.Catalog, error) {
	var internal mongoCatalog
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&internal); err != nil {
		return nil, err
	}
	return internal.ToAggregate(), nil
}

func (r *RepoCatalog) CreateCatalog(ctx context.Context, c *catalog.Catalog) error {
	_, err := r.Coll().InsertOne(ctx, newFromCatalog(c))
	return err
}

func (r *RepoCatalog) UpdateCatalog(ctx context.Context, c *catalog.Catalog) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": c.GetId(),
	}, bson.M{
		"$set": newFromCatalog(c),
	})
	return err
}

func (r *RepoCatalog) PublishCatalog(ctx context.Context, c *catalog.Catalog) error {
	_, err := r.CollPublishedCatalog().InsertOne(ctx, bson.M{
		"_id":       uuid.NewUUID(),
		"catalogId": c.GetId(),
		"structure": newFromCatalog(c).Structure,
		"createdAt": time.Now(),
		"version":   c.GetVersion() + 1,
	})
	return err
}
