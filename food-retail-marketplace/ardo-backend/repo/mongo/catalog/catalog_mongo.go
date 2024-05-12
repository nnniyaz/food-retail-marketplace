package catalog

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/exceptions"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/domain/slide"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

type mongoCatalog struct {
	Id        uuid.UUID `bson:"_id"`
	Structure []struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		} `bson:"categories"`
	} `bson:"structure"`
	Promo []struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		} `bson:"categories"`
	} `bson:"promo"`
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
			} `bson:"products"`
		} `bson:"categories"`
	}, len(c.GetStructure()))

	for i, catalogSection := range c.GetStructure() {
		structure[i].SectionId = catalogSection.GetId()
		structure[i].Categories = make([]struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		}, len(catalogSection.GetCategories()))

		for j, catalogCategory := range catalogSection.GetCategories() {
			structure[i].Categories[j].CategoryId = catalogCategory.GetId()
			structure[i].Categories[j].Products = make([]struct {
				ProductId uuid.UUID `bson:"productId"`
			}, len(catalogCategory.GetProducts()))

			for k, catalogProduct := range catalogCategory.GetProducts() {
				structure[i].Categories[j].Products[k].ProductId = catalogProduct.GetId()
			}
		}
	}

	promo := make([]struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		} `bson:"categories"`
	}, len(c.GetPromo()))

	for i, promoSection := range c.GetPromo() {
		promo[i].SectionId = promoSection.GetId()
		promo[i].Categories = make([]struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		}, len(promoSection.GetCategories()))

		for j, promoCategory := range promoSection.GetCategories() {
			promo[i].Categories[j].CategoryId = promoCategory.GetId()
			promo[i].Categories[j].Products = make([]struct {
				ProductId uuid.UUID `bson:"productId"`
			}, len(promoCategory.GetProducts()))

			for k, promoProduct := range promoCategory.GetProducts() {
				promo[i].Categories[j].Products[k].ProductId = promoProduct.GetId()
			}
		}
	}

	return &mongoCatalog{
		Id:        c.GetId(),
		Structure: structure,
		Promo:     promo,
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

	promo := make([]valueObject.CatalogsSection, len(m.Promo))
	for i, promoSection := range m.Promo {
		categories := make([]valueObject.CatalogsCategory, len(promoSection.Categories))
		for j, promoCategory := range promoSection.Categories {
			products := make([]valueObject.CatalogsProduct, len(promoCategory.Products))
			for k, promoProduct := range promoCategory.Products {
				products[k] = valueObject.UnmarshalCatalogsProductFromDatabase(promoProduct.ProductId)
			}
			categories[j] = valueObject.UnmarshalCatalogsCategoryFromDatabase(promoCategory.CategoryId, products)
		}
		promo[i] = valueObject.UnmarshalCatalogsSectionFromDatabase(promoSection.SectionId, categories)
	}
	return catalog.UnmarshalCatalogFromDatabase(m.Id, structure, promo, m.CreatedAt, m.UpdatedAt, m.Version)
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
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, exceptions.ErrCatalogNotFound
		}
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
			} `bson:"products"`
		} `bson:"categories"`
	} `bson:"structure"`
	Promo []struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		} `bson:"categories"`
	} `bson:"promo"`
	Sections map[string]struct {
		Id        uuid.UUID     `bson:"_id"`
		Name      core.MlString `bson:"name"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	} `bson:"sections"`
	Categories map[string]struct {
		Id        uuid.UUID     `bson:"_id"`
		Name      core.MlString `bson:"name"`
		Desc      core.MlString `bson:"desc"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	} `bson:"categories"`
	Products map[string]struct {
		Id            uuid.UUID     `bson:"_id"`
		Name          core.MlString `bson:"name"`
		Desc          core.MlString `bson:"desc"`
		Price         float64       `bson:"price"`
		OriginalPrice float64       `bson:"originalPrice"`
		Quantity      int64         `bson:"quantity"`
		Unit          string        `bson:"unit"`
		Moq           int64         `bson:"moq"`
		CutOffTime    time.Time     `bson:"cutOffTime"`
		Tags          []string      `bson:"tags"`
		Img           string        `bson:"img"`
		Status        string        `bson:"status"`
		IsDeleted     bool          `bson:"isDeleted"`
		CreatedAt     time.Time     `bson:"createdAt"`
		UpdatedAt     time.Time     `bson:"updatedAt"`
		Version       int           `bson:"version"`
	} `bson:"products"`
	Slides []struct {
		Id        uuid.UUID     `bson:"_id"`
		Caption   core.MlString `bson:"caption"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	} `bson:"slides"`
	PublishedAt time.Time `bson:"publishedAt"`
}

func newFromPublishedCatalog(c *catalog.Catalog, selectedSections map[string]*section.Section, selectedCategories map[string]*category.Category, selectedProducts map[string]*product.Product, slides []*slide.Slide) *mongoPublishedCatalog {
	structure := make([]struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		} `bson:"categories"`
	}, len(c.GetStructure()))

	for i, catalogSection := range c.GetStructure() {
		structure[i].SectionId = catalogSection.GetId()
		structure[i].Categories = make([]struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		}, len(catalogSection.GetCategories()))

		for j, catalogCategory := range catalogSection.GetCategories() {
			structure[i].Categories[j].CategoryId = catalogCategory.GetId()
			structure[i].Categories[j].Products = make([]struct {
				ProductId uuid.UUID `bson:"productId"`
			}, len(catalogCategory.GetProducts()))

			for k, catalogProduct := range catalogCategory.GetProducts() {
				structure[i].Categories[j].Products[k].ProductId = catalogProduct.GetId()
			}
		}
	}

	promo := make([]struct {
		SectionId  uuid.UUID `bson:"sectionId"`
		Categories []struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		} `bson:"categories"`
	}, len(c.GetPromo()))

	for i, promoSection := range c.GetPromo() {
		promo[i].SectionId = promoSection.GetId()
		promo[i].Categories = make([]struct {
			CategoryId uuid.UUID `bson:"categoryId"`
			Products   []struct {
				ProductId uuid.UUID `bson:"productId"`
			} `bson:"products"`
		}, len(promoSection.GetCategories()))

		for j, promoCategory := range promoSection.GetCategories() {
			promo[i].Categories[j].CategoryId = promoCategory.GetId()
			promo[i].Categories[j].Products = make([]struct {
				ProductId uuid.UUID `bson:"productId"`
			}, len(promoCategory.GetProducts()))

			for k, promoProduct := range promoCategory.GetProducts() {
				promo[i].Categories[j].Products[k].ProductId = promoProduct.GetId()
			}
		}
	}

	selectedSectionsMap := make(map[string]struct {
		Id        uuid.UUID     `bson:"_id"`
		Name      core.MlString `bson:"name"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	}, len(selectedSections))

	for k, v := range selectedSections {
		selectedSectionsMap[k] = struct {
			Id        uuid.UUID     `bson:"_id"`
			Name      core.MlString `bson:"name"`
			Img       string        `bson:"img"`
			IsDeleted bool          `bson:"isDeleted"`
			CreatedAt time.Time     `bson:"createdAt"`
			UpdatedAt time.Time     `bson:"updatedAt"`
			Version   int           `bson:"version"`
		}{
			Id:        v.GetId(),
			Name:      v.GetName(),
			Img:       v.GetImg(),
			IsDeleted: v.GetIsDeleted(),
			CreatedAt: v.GetCreatedAt(),
			UpdatedAt: v.GetUpdatedAt(),
			Version:   v.GetVersion(),
		}
	}

	selectedCategoriesMap := make(map[string]struct {
		Id        uuid.UUID     `bson:"_id"`
		Name      core.MlString `bson:"name"`
		Desc      core.MlString `bson:"desc"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	}, len(selectedCategories))

	for k, v := range selectedCategories {
		selectedCategoriesMap[k] = struct {
			Id        uuid.UUID     `bson:"_id"`
			Name      core.MlString `bson:"name"`
			Desc      core.MlString `bson:"desc"`
			Img       string        `bson:"img"`
			IsDeleted bool          `bson:"isDeleted"`
			CreatedAt time.Time     `bson:"createdAt"`
			UpdatedAt time.Time     `bson:"updatedAt"`
			Version   int           `bson:"version"`
		}{
			Id:        v.GetId(),
			Name:      v.GetName(),
			Desc:      v.GetDesc(),
			Img:       v.GetImg(),
			IsDeleted: v.GetIsDeleted(),
			CreatedAt: v.GetCreatedAt(),
			UpdatedAt: v.GetUpdatedAt(),
			Version:   v.GetVersion(),
		}
	}

	selectedProductsMap := make(map[string]struct {
		Id            uuid.UUID     `bson:"_id"`
		Name          core.MlString `bson:"name"`
		Desc          core.MlString `bson:"desc"`
		Price         float64       `bson:"price"`
		OriginalPrice float64       `bson:"originalPrice"`
		Quantity      int64         `bson:"quantity"`
		Unit          string        `bson:"unit"`
		Moq           int64         `bson:"moq"`
		CutOffTime    time.Time     `bson:"cutOffTime"`
		Tags          []string      `bson:"tags"`
		Img           string        `bson:"img"`
		Status        string        `bson:"status"`
		IsDeleted     bool          `bson:"isDeleted"`
		CreatedAt     time.Time     `bson:"createdAt"`
		UpdatedAt     time.Time     `bson:"updatedAt"`
		Version       int           `bson:"version"`
	}, len(selectedProducts))

	for k, v := range selectedProducts {
		selectedProductsMap[k] = struct {
			Id            uuid.UUID     `bson:"_id"`
			Name          core.MlString `bson:"name"`
			Desc          core.MlString `bson:"desc"`
			Price         float64       `bson:"price"`
			OriginalPrice float64       `bson:"originalPrice"`
			Quantity      int64         `bson:"quantity"`
			Unit          string        `bson:"unit"`
			Moq           int64         `bson:"moq"`
			CutOffTime    time.Time     `bson:"cutOffTime"`
			Tags          []string      `bson:"tags"`
			Img           string        `bson:"img"`
			Status        string        `bson:"status"`
			IsDeleted     bool          `bson:"isDeleted"`
			CreatedAt     time.Time     `bson:"createdAt"`
			UpdatedAt     time.Time     `bson:"updatedAt"`
			Version       int           `bson:"version"`
		}{
			Id:            v.GetId(),
			Name:          v.GetName(),
			Desc:          v.GetDesc(),
			Price:         v.GetPrice(),
			OriginalPrice: v.GetOriginalPrice(),
			Quantity:      v.GetQuantity(),
			Unit:          v.GetUnit().String(),
			Moq:           v.GetMoq(),
			CutOffTime:    v.GetCutOffTime(),
			Tags:          v.GetTags(),
			Img:           v.GetImg(),
			Status:        v.GetStatus().String(),
			IsDeleted:     v.GetIsDeleted(),
			CreatedAt:     v.GetCreatedAt(),
			UpdatedAt:     v.GetUpdatedAt(),
			Version:       v.GetVersion(),
		}
	}

	slidesSlice := make([]struct {
		Id        uuid.UUID     `bson:"_id"`
		Caption   core.MlString `bson:"caption"`
		Img       string        `bson:"img"`
		IsDeleted bool          `bson:"isDeleted"`
		CreatedAt time.Time     `bson:"createdAt"`
		UpdatedAt time.Time     `bson:"updatedAt"`
		Version   int           `bson:"version"`
	}, len(slides))

	for i, v := range slides {
		slidesSlice[i] = struct {
			Id        uuid.UUID     `bson:"_id"`
			Caption   core.MlString `bson:"caption"`
			Img       string        `bson:"img"`
			IsDeleted bool          `bson:"isDeleted"`
			CreatedAt time.Time     `bson:"createdAt"`
			UpdatedAt time.Time     `bson:"updatedAt"`
			Version   int           `bson:"version"`
		}{
			Id:        v.GetId(),
			Caption:   v.GetCaption(),
			Img:       v.GetImg(),
			IsDeleted: v.GetIsDeleted(),
			CreatedAt: v.GetCreatedAt(),
			UpdatedAt: v.GetUpdatedAt(),
			Version:   v.GetVersion(),
		}
	}

	return &mongoPublishedCatalog{
		CatalogId:   c.GetId(),
		Structure:   structure,
		Promo:       promo,
		Sections:    selectedSectionsMap,
		Categories:  selectedCategoriesMap,
		Products:    selectedProductsMap,
		Slides:      slidesSlice,
		PublishedAt: time.Now(),
	}
}

func (r *RepoCatalog) PublishCatalog(ctx context.Context, catalog *catalog.Catalog, selectedSections map[string]*section.Section, selectedCategories map[string]*category.Category, selectedProducts map[string]*product.Product, slides []*slide.Slide) error {
	count, err := r.CollPublishedCatalog().CountDocuments(ctx, bson.M{"catalogId": catalog.GetId()})
	if err != nil {
		return err
	}

	pc := newFromPublishedCatalog(catalog, selectedSections, selectedCategories, selectedProducts, slides)
	if count > 0 {
		_, err = r.CollPublishedCatalog().UpdateOne(ctx, bson.M{"catalogId": catalog.GetId()}, bson.M{"$set": pc})
		return err
	}
	_, err = r.CollPublishedCatalog().InsertOne(ctx, pc)
	return err
}

func (r *RepoCatalog) GetTimeOfPublish(ctx context.Context, catalogId uuid.UUID) (time.Time, error) {
	var pc mongoPublishedCatalog
	if err := r.CollPublishedCatalog().FindOne(ctx, bson.M{
		"catalogId": catalogId,
	}, options.FindOne().SetProjection(bson.M{
		"publishedAt": 1,
	})).Decode(&pc); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return time.Time{}, exceptions.ErrCatalogNotFound
		}
		return time.Time{}, err
	}
	return pc.PublishedAt, nil
}
