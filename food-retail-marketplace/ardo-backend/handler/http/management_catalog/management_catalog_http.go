package management_catalog

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog"
	"github/nnniyaz/ardo/domain/catalog/exceptions"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementCatalogService
}

func NewHttpDelivery(l logger.Logger, service management.ManagementCatalogService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Product struct {
	ProductId string `json:"productId"`
}

type Category struct {
	CategoryId string    `json:"categoryId"`
	Products   []Product `json:"products"`
}

type Section struct {
	SectionId  string     `json:"sectionId"`
	Categories []Category `json:"categories"`
}

type Catalog struct {
	Id        string    `json:"id"`
	Structure []Section `json:"structure"`
	Promo     []Section `json:"promo"`
	CreatedAt string    `json:"createdAt"`
	UpdatedAt string    `json:"updated_at"`
	Version   int       `json:"version"`
}

func NewCatalog(catalog *catalog.Catalog) *Catalog {
	var structure []Section
	for _, section := range catalog.GetStructure() {
		var categories []Category
		for _, category := range section.GetCategories() {
			var products []Product
			for _, product := range category.GetProducts() {
				products = append(products, Product{ProductId: product.GetId().String()})
			}
			categories = append(categories, Category{CategoryId: category.GetId().String(), Products: products})
		}
		structure = append(structure, Section{SectionId: section.GetId().String(), Categories: categories})
	}

	var promo []Section
	for _, promoSection := range catalog.GetPromo() {
		var promoCategories []Category
		for _, promoCategory := range promoSection.GetCategories() {
			var promoProducts []Product
			for _, promoProduct := range promoCategory.GetProducts() {
				promoProducts = append(promoProducts, Product{ProductId: promoProduct.GetId().String()})
			}
			promoCategories = append(promoCategories, Category{CategoryId: promoCategory.GetId().String(), Products: promoProducts})
		}
		promo = append(promo, Section{SectionId: promoSection.GetId().String(), Categories: promoCategories})
	}

	return &Catalog{
		Id:        catalog.GetId().String(),
		Structure: structure,
		Promo:     promo,
		CreatedAt: catalog.GetCreatedAt().String(),
		UpdatedAt: catalog.GetUpdatedAt().String(),
		Version:   catalog.GetVersion(),
	}
}

type Catalogs struct {
	Catalogs []*Catalog `json:"catalogs"`
	Count    int64      `json:"count"`
}

func NewCatalogs(catalogs []*catalog.Catalog, count int64) *Catalogs {
	var result []*Catalog
	for _, c := range catalogs {
		result = append(result, NewCatalog(c))
	}
	return &Catalogs{Catalogs: result, Count: count}
}

func (hd *HttpDelivery) GetAllCatalogs(w http.ResponseWriter, r *http.Request) {
	foundCatalogs, count, err := hd.service.GetAllCatalogs(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewCatalogs(foundCatalogs, count))
}

func (hd *HttpDelivery) GetCatalogById(w http.ResponseWriter, r *http.Request) {
	catalogId := chi.URLParam(r, "catalog_id")
	foundCatalog, err := hd.service.GetCatalogById(r.Context(), catalogId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewCatalog(foundCatalog))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) CreateCatalog(w http.ResponseWriter, r *http.Request) {
	if err := hd.service.CreateCatalog(r.Context()); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateCatalogIn struct {
	Structure []Section `json:"structure"`
	Promo     []Section `json:"promo"`
}

func UnmarshalStructure(structure []Section) ([]valueObject.CatalogsSection, error) {
	var sections []valueObject.CatalogsSection
	sectionIds := make(map[string]bool)
	categoryIds := make(map[string]bool)
	productIds := make(map[string]bool)
	for _, section := range structure {
		var categories []valueObject.CatalogsCategory
		for _, category := range section.Categories {
			var products []valueObject.CatalogsProduct
			for _, product := range category.Products {
				productId, err := uuid.UUIDFromString(product.ProductId)
				if err != nil {
					return nil, err
				}

				// check for the duplicate product
				if productIds[product.ProductId] {
					return nil, exceptions.ErrDuplicateProduct
				}
				productIds[product.ProductId] = true

				products = append(products, valueObject.UnmarshalCatalogsProductFromDatabase(productId))
			}
			categoryId, err := uuid.UUIDFromString(category.CategoryId)
			if err != nil {
				return nil, err
			}

			// check for the duplicate category
			if categoryIds[category.CategoryId] {
				return nil, exceptions.ErrDuplicateCategory
			}
			categoryIds[category.CategoryId] = true

			categories = append(categories, valueObject.UnmarshalCatalogsCategoryFromDatabase(categoryId, products))
		}
		sectionId, err := uuid.UUIDFromString(section.SectionId)
		if err != nil {
			return nil, err
		}

		// check for the duplicate section
		if sectionIds[section.SectionId] {
			return nil, exceptions.ErrDuplicateSection
		}
		sectionIds[section.SectionId] = true

		sections = append(sections, valueObject.UnmarshalCatalogsSectionFromDatabase(sectionId, categories))
	}
	return sections, nil
}

func (hd *HttpDelivery) UpdateCatalog(w http.ResponseWriter, r *http.Request) {
	var in UpdateCatalogIn
	catalogId := chi.URLParam(r, "catalog_id")
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	structure, err := UnmarshalStructure(in.Structure)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	promo, err := UnmarshalStructure(in.Promo)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateCatalog(r.Context(), catalogId, structure, promo); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) PublishCatalog(w http.ResponseWriter, r *http.Request) {
	catalogId := chi.URLParam(r, "catalog_id")
	if err := hd.service.PublishCatalog(r.Context(), catalogId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
