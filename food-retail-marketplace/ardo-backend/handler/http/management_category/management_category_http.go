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

// GetCategoriesByFilters godoc
//
//	@Summary		Get categories by filters
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Categories
//	@Accept			json
//	@Produce		json
//	@Param			offset		query		int		false	"Offset"
//	@Param			limit		query		int		false	"Limit"
//	@Param			is_deleted	query		bool	false	"Is deleted"
//	@Success		200			{object}	response.Success{data=CategoriesData}
//	@Failure		default		{object}	response.Error
//	@Router			/management/categories [get]
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

// GetCategoryById godoc
//
//	@Summary		Get category by id
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Categories
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=Category}
//	@Failure		default	{object}	response.Error
//	@Router			/management/categories{category_id} [get]
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

// CreateCategory godoc
//
//	@Summary		Create category
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Categories
//	@Accept			json
//	@Produce		json
//	@Param			data	body		CreateCategoryIn	true	"Create category object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/categories [post]
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

// UpdateCategory godoc
//
//	@Summary		Update category
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Categories
//	@Accept			json
//	@Produce		json
//	@Param			data	body		CreateCategoryIn	true	"Update category object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/categories [put]
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

// RecoverCategory godoc
//
//	@Summary		Recover deleted category
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Categories
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/categories/recover/{category_id} [put]
func (hd *HttpDelivery) RecoverCategory(w http.ResponseWriter, r *http.Request) {
	categoryId := chi.URLParam(r, "category_id")
	if err := hd.service.RecoverCategory(r.Context(), categoryId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteCategory godoc
//
//	@Summary		Delete category
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Categories
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/categories/{category_id} [delete]
func (hd *HttpDelivery) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	categoryId := chi.URLParam(r, "category_id")
	if err := hd.service.DeleteCategory(r.Context(), categoryId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
