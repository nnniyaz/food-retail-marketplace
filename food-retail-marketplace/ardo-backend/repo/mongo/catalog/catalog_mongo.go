package catalog

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
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

// -----------------------------------------------------------------------------
// Catalog

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

type mongoPublishedCatalogSection struct {
	Id        uuid.UUID     `bson:"_id"`
	Name      core.MlString `bson:"name"`
	Img       string        `bson:"img"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Version   int           `bson:"version"`
}

type mongoPublishedCatalogCategory struct {
	Id        uuid.UUID     `bson:"_id"`
	Name      core.MlString `bson:"name"`
	Desc      core.MlString `bson:"desc"`
	Img       string        `bson:"img"`
	IsDeleted bool          `bson:"isDeleted"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
	Version   int           `bson:"version"`
}

type mongoPublishedCatalogProduct struct {
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

type mongoPublishedCatalog struct {
	CatalogId uuid.UUID `bson:"catalogId"`
	Structure []struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			}
		}
	}
	Sections   []mongoPublishedCatalogSection  `bson:"sections"`
	Categories []mongoPublishedCatalogCategory `bson:"categories"`
	Products   []mongoPublishedCatalogProduct  `bson:"products"`
	Slides     []struct {
		Id        uuid.UUID     `bson:"_id"`
		Caption   core.MlString `bson:"caption"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	}
}

func (r *RepoCatalog) PublishCatalog(ctx context.Context, c *catalog.Catalog) error {
	pipeline := []bson.M{
		{
			"$match": bson.M{
				"_id": c.GetId(),
			},
		},
		{
			"$lookup": bson.M{
				"from": "sections",
				"let":  bson.M{"section_id": "$structure.sectionId"},
				"pipeline": bson.A{
					bson.M{"$match": bson.M{"$expr": bson.M{"$in": bson.A{"$_id", "$$section_id"}}}},
				},
				"as": "sections",
			},
		},
		{
			"$lookup": bson.M{
				"from": "categories",
				"let": bson.M{
					"categoryIds": bson.M{
						"$reduce": bson.M{
							"input":        "$structure",
							"initialValue": bson.A{},
							"in": bson.M{
								"$setUnion": bson.A{"$$value", "$$this.categories.categoryId"},
							},
						},
					},
				},
				"pipeline": bson.A{
					bson.M{"$match": bson.M{"$expr": bson.M{"$in": bson.A{"$_id", "$$categoryIds"}}}},
				},
				"as": "categories",
			},
		},
		{
			"$lookup": bson.M{
				"from": "products",
				"let": bson.M{
					"productIds": bson.M{
						"$reduce": bson.M{
							"input":        "$structure",
							"initialValue": bson.A{},
							"in": bson.M{
								"$concatArrays": bson.A{
									"$$value",
									bson.M{
										"$reduce": bson.M{
											"input":        "$$this.categories",
											"initialValue": bson.A{},
											"in": bson.M{
												"$concatArrays": bson.A{"$$value", "$$this.products.productId"},
											},
										},
									},
								},
							},
						},
					},
				},
				"pipeline": bson.A{
					bson.M{"$match": bson.M{"$expr": bson.M{"$in": bson.A{"$_id", "$$productIds"}}}},
				},
				"as": "products",
			},
		},
		{
			"$lookup": bson.M{
				"from":     "slides",
				"pipeline": bson.A{},
				"as":       "slides",
			},
		},
		{
			"$project": bson.M{
				"catalogId": "$_id",
				"structure": "$structure",
				"sections": bson.M{
					"$map": bson.M{
						"input": "$sections", "as": "section", "in": bson.M{
							"_id":       "$$section._id",
							"name":      "$$section.name",
							"img":       "$$section.img",
							"isDeleted": "$$section.isDeleted",
							"createdAt": "$$section.createdAt",
							"updatedAt": "$$section.updatedAt",
							"version":   "$$section.version",
						},
					},
				},
				"categories": bson.M{
					"$map": bson.M{
						"input": "$categories", "as": "category", "in": bson.M{
							"_id":       "$$category._id",
							"name":      "$$category.name",
							"desc":      "$$category.desc",
							"img":       "$$category.img",
							"isDeleted": "$$category.isDeleted",
							"createdAt": "$$category.createdAt",
							"updatedAt": "$$category.updatedAt",
							"version":   "$$category.version",
						},
					},
				},
				"products": bson.M{
					"$map": bson.M{
						"input": "$products", "as": "product", "in": bson.M{
							"_id":       "$$product._id",
							"name":      "$$product.name",
							"desc":      "$$product.desc",
							"price":     "$$product.price",
							"quantity":  "$$product.quantity",
							"img":       "$$product.img",
							"status":    "$$product.status",
							"isDeleted": "$$product.isDeleted",
							"createdAt": "$$product.createdAt",
							"updatedAt": "$$product.updatedAt",
							"version":   "$$product.version",
						},
					},
				},
				"slides": bson.M{
					"$map": bson.M{
						"input": "$slides", "as": "slide", "in": bson.M{
							"_id":       "$$slide._id",
							"caption":   "$$slide.caption",
							"img":       "$$slide.img",
							"isDeleted": "$$slide.isDeleted",
							"createdAt": "$$slide.createdAt",
							"updatedAt": "$$slide.updatedAt",
							"version":   "$$slide.version",
						},
					},
				},
			},
		},
	}
	cur, err := r.Coll().Aggregate(ctx, pipeline)
	if err != nil {
		return err
	}
	defer cur.Close(ctx)

	var publishedCatalogs []mongoPublishedCatalog
	for cur.Next(ctx) {
		var publishedCatalog mongoPublishedCatalog
		if err = cur.Decode(&publishedCatalog); err != nil {
			return err
		}
		publishedCatalogs = append(publishedCatalogs, publishedCatalog)
	}

	var sections = make(map[string]mongoPublishedCatalogSection)
	for _, section := range publishedCatalogs[0].Sections {
		sections[section.Id.String()] = section
	}
	var categories = make(map[string]mongoPublishedCatalogCategory)
	for _, category := range publishedCatalogs[0].Categories {
		categories[category.Id.String()] = category
	}
	var products = make(map[string]mongoPublishedCatalogProduct)
	for _, product := range publishedCatalogs[0].Products {
		products[product.Id.String()] = product
	}

	count, err := r.CollPublishedCatalog().CountDocuments(ctx, bson.M{"catalogId": c.GetId()})
	if err != nil {
		return err
	}
	if count > 0 {
		_, err = r.CollPublishedCatalog().UpdateOne(ctx, bson.M{"catalogId": c.GetId()}, bson.M{
			"$set": bson.M{
				"structure":  publishedCatalogs[0].Structure,
				"sections":   sections,
				"categories": categories,
				"products":   products,
				"slides":     publishedCatalogs[0].Slides,
				"updatedAt":  time.Now(),
			},
			"$inc": bson.M{"version": 1},
		})
		return err
	}
	_, err = r.CollPublishedCatalog().InsertOne(ctx, bson.M{
		"catalogId":  c.GetId(),
		"structure":  publishedCatalogs[0].Structure,
		"sections":   sections,
		"categories": categories,
		"products":   products,
		"slides":     publishedCatalogs[0].Slides,
		"createdAt":  time.Now(),
		"updatedAt":  time.Now(),
		"version":    1,
	})
	return err
}
