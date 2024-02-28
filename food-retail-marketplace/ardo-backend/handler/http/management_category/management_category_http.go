package management_category

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementCategoryService
}

func NewHttpDelivery(l logger.Logger, service management.ManagementCategoryService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Category struct {
	Id        string        `json:"id"`
	Name      core.MlString `json:"name"`
	Desc      core.MlString `json:"desc"`
	Img       string        `json:"img"`
	IsDeleted bool          `json:"isDeleted"`
	CreatedAt time.Time     `json:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt"`
	Version   int           `json:"version"`
}

func NewCategory(c *category.Category) *Category {
	return &Category{
		Id:        c.GetId().String(),
		Name:      c.GetName(),
		Desc:      c.GetDesc(),
		Img:       c.GetImg(),
		IsDeleted: c.GetIsDeleted(),
		CreatedAt: c.GetCreatedAt(),
		UpdatedAt: c.GetUpdatedAt(),
		Version:   c.GetVersion(),
	}
}

type CategoriesData struct {
	Categories []*Category `json:"categories"`
	Count      int64       `json:"count"`
}

func NewCategories(categories []*category.Category, count int64) *CategoriesData {
	var cs []*Category
	for _, c := range categories {
		cs = append(cs, NewCategory(c))
	}
	return &CategoriesData{Categories: cs, Count: count}
}

func (hd *HttpDelivery) GetCategoriesByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	categories, count, err := hd.service.GetCategoriesByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewCategories(categories, count))
}

func (hd *HttpDelivery) GetCategoryById(w http.ResponseWriter, r *http.Request) {
	categoryId := chi.URLParam(r, "category_id")
	c, err := hd.service.GetCategoryById(r.Context(), categoryId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewCategory(c))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateCategoryIn struct {
	Name core.MlString `json:"name"`
	Desc core.MlString `json:"desc"`
	Img  string        `json:"img"`
}

func (hd *HttpDelivery) CreateCategory(w http.ResponseWriter, r *http.Request) {
	in := CreateCategoryIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.CreateCategory(r.Context(), in.Name, in.Desc, in.Img); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateCategoryIn struct {
	Name core.MlString `json:"name"`
	Desc core.MlString `json:"desc"`
	Img  string        `json:"img"`
}

func (hd *HttpDelivery) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	categoryId := chi.URLParam(r, "category_id")
	in := UpdateCategoryIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateCategory(r.Context(), categoryId, in.Name, in.Desc, in.Img); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) RecoverCategory(w http.ResponseWriter, r *http.Request) {
	categoryId := chi.URLParam(r, "category_id")
	if err := hd.service.RecoverCategory(r.Context(), categoryId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	categoryId := chi.URLParam(r, "category_id")
	if err := hd.service.DeleteCategory(r.Context(), categoryId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
