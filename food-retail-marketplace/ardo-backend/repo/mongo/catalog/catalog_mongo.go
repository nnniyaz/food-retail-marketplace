package catalog

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/pkg/core"
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
	for i, catalogsSection := range c.GetStructure() {
		structure[i] = newFromCatalogsSection(catalogsSection)
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
	for i, catalogsSection := range m.Structure {
		structure[i] = catalogsSection.ToAggregate()
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

// -----------------------------------------------------------------------------
// Published Catalog

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

type mongoSections struct {
	Sections map[string]*mongoSection `bson:"sections"`
}

func newFromSections(sections map[string]*section.Section) mongoSections {
	internal := make(map[string]*mongoSection)
	for id, section := range sections {
		internal[id] = newFromSection(section)
	}
	return mongoSections{Sections: internal}
}

func (m *mongoSections) ToAggregate() map[string]*section.Section {
	internal := make(map[string]*section.Section)
	for id, section := range m.Sections {
		internal[id] = section.ToAggregate()
	}
	return internal
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

type mongoCategories struct {
	Categories map[string]*mongoCategory `bson:"categories"`
}

func newFromCategories(categories map[string]*category.Category) mongoCategories {
	internal := make(map[string]*mongoCategory)
	for id, category := range categories {
		internal[id] = newFromCategory(category)
	}
	return mongoCategories{Categories: internal}
}

func (m *mongoCategories) ToAggregate() map[string]*category.Category {
	internal := make(map[string]*category.Category)
	for id, category := range m.Categories {
		internal[id] = category.ToAggregate()
	}
	return internal
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

type mongoProducts struct {
	Products map[string]*mongoProduct `bson:"products"`
}

func newFromProducts(products map[string]*product.Product) mongoProducts {
	internal := make(map[string]*mongoProduct)
	for id, product := range products {
		internal[id] = newFromProduct(product)
	}
	return mongoProducts{Products: internal}
}

func (m *mongoProducts) ToAggregate() map[string]*product.Product {
	internal := make(map[string]*product.Product)
	for id, product := range m.Products {
		internal[id] = product.ToAggregate()
	}
	return internal
}

func (r *RepoCatalog) PublishCatalog(ctx context.Context, c *catalog.Catalog, sections map[string]*section.Section, categories map[string]*category.Category, products map[string]*product.Product) error {
	_, err := r.CollPublishedCatalog().InsertOne(ctx, bson.M{
		"_id":        uuid.NewUUID(),
		"catalogId":  c.GetId(),
		"structure":  newFromCatalog(c).Structure,
		"sections":   newFromSections(sections).Sections,
		"categories": newFromCategories(categories).Categories,
		"products":   newFromProducts(products).Products,
		"createdAt":  time.Now(),
		"version":    c.GetVersion() + 1,
	})
	return err
}
