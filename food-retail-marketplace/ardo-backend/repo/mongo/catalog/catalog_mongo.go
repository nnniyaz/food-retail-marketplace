package catalog

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/domain/slide"
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

//type mongoCatalogsProduct struct {
//	ProductId uuid.UUID `bson:"productId"`
//}
//
//func newFromCatalogsProduct(catalogsProduct valueObject.CatalogsProduct) mongoCatalogsProduct {
//	return mongoCatalogsProduct{
//		ProductId: catalogsProduct.GetId(),
//	}
//}
//
//func (m *mongoCatalogsProduct) ToAggregate() valueObject.CatalogsProduct {
//	return valueObject.UnmarshalCatalogsProductFromDatabase(m.ProductId)
//}
//
//type mongoCatalogsCategory struct {
//	CategoryId uuid.UUID              `bson:"categoryId"`
//	Products   []mongoCatalogsProduct `bson:"products"`
//}
//
//func newFromCatalogsCategory(catalogsCategory valueObject.CatalogsCategory) mongoCatalogsCategory {
//	products := make([]mongoCatalogsProduct, len(catalogsCategory.GetProducts()))
//	for i, product := range catalogsCategory.GetProducts() {
//		products[i] = newFromCatalogsProduct(product)
//	}
//	return mongoCatalogsCategory{
//		CategoryId: catalogsCategory.GetId(),
//		Products:   products,
//	}
//}
//
//func (m *mongoCatalogsCategory) ToAggregate() valueObject.CatalogsCategory {
//	products := make([]valueObject.CatalogsProduct, len(m.Products))
//	for i, product := range m.Products {
//		products[i] = product.ToAggregate()
//	}
//	return valueObject.UnmarshalCatalogsCategoryFromDatabase(m.CategoryId, products)
//}
//
//type mongoCatalogsSection struct {
//	SectionId  uuid.UUID               `bson:"sectionId"`
//	Categories []mongoCatalogsCategory `bson:"categories"`
//}
//
//func newFromCatalogsSection(catalogsSection valueObject.CatalogsSection) mongoCatalogsSection {
//	categories := make([]mongoCatalogsCategory, len(catalogsSection.GetCategories()))
//	for i, category := range catalogsSection.GetCategories() {
//		categories[i] = newFromCatalogsCategory(category)
//	}
//	return mongoCatalogsSection{
//		SectionId:  catalogsSection.GetId(),
//		Categories: categories,
//	}
//}
//
//func (m *mongoCatalogsSection) ToAggregate() valueObject.CatalogsSection {
//	categories := make([]valueObject.CatalogsCategory, len(m.Categories))
//	for i, category := range m.Categories {
//		categories[i] = category.ToAggregate()
//	}
//	return valueObject.UnmarshalCatalogsSectionFromDatabase(m.SectionId, categories)
//}

type mongoCatalog struct {
	Id        uuid.UUID `bson:"_id"`
	Structure []struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			}
		}
	} `bson:"structure"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
	Version   int       `bson:"version"`
}

func newFromCatalog(c *catalog.Catalog) *mongoCatalog {
	structure := make([]struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			}
		}
	}, len(c.GetStructure()))
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
	for i, catalogSection := range m.Structure {
		categories := make([]valueObject.CatalogsCategory, len(catalogSection.Categories))
		for j, catalogCategory := range catalogSection.Categories {
			products := make([]valueObject.CatalogsProduct, len(catalogCategory.Products))
			for k, catalogProduct := range catalogCategory.Products {
				products[k] = valueObject.UnmarshalCatalogsProductFromDatabase(catalogProduct.ProductId)
			}
			categories[j] = valueObject.UnmarshalCatalogsCategoryFromDatabase(catalogCategory.CategoryId, products)
		}
		structure[i] = valueObject.UnmarshalCatalogsSectionFromDatabase(catalogSection.SectionId, categories)
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
	} `bson:"structure"`
	Sections   map[string]*section.Section   `bson:"sections"`
	Categories map[string]*category.Category `bson:"categories"`
	Products   map[string]*product.Product   `bson:"products"`
	Slides     []*slide.Slide                `bson:"slides"`
	CreatedAt  time.Time                     `bson:"createdAt"`
	UpdatedAt  time.Time                     `bson:"updatedAt"`
	Version    int                           `bson:"version"`
}

func newFromPublishedCatalog(c *catalog.Catalog, selectedSections map[string]*section.Section, selectedCategories map[string]*category.Category, selectedProducts map[string]*product.Product, slides []*slide.Slide) *mongoPublishedCatalog {
	structure := make([]struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			}
		}
	}, len(c.GetStructure()))
	return &mongoPublishedCatalog{
		CatalogId:  c.GetId(),
		Structure:  structure,
		Sections:   selectedSections,
		Categories: selectedCategories,
		Products:   selectedProducts,
		Slides:     slides,
	}
}

func (r *RepoCatalog) PublishCatalog(ctx context.Context, catalog *catalog.Catalog, selectedSections map[string]*section.Section, selectedCategories map[string]*category.Category, selectedProducts map[string]*product.Product, slides []*slide.Slide) error {
	count, err := r.CollPublishedCatalog().CountDocuments(ctx, bson.M{"catalogId": catalog.GetId()})
	if err != nil {
		return err
	}

	pc := newFromPublishedCatalog(catalog, selectedSections, selectedCategories, selectedProducts, slides)
	if count > 0 {
		pc.UpdatedAt = time.Now()
		
		_, err = r.CollPublishedCatalog().UpdateOne(ctx, bson.M{"catalogId": catalog.GetId()}, bson.M{
			"$set": pc,
			"$inc": bson.M{"version": 1},
		})
		return err
	}

	pc.CreatedAt = time.Now()
	pc.UpdatedAt = time.Now()
	pc.Version = 1
	_, err = r.CollPublishedCatalog().InsertOne(ctx, pc)
	return err
}
