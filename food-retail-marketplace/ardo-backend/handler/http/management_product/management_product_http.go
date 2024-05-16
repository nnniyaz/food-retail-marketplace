package management_product

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementProductService
}

func NewHttpDelivery(l logger.Logger, s management.ManagementProductService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: s}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Product struct {
	Id            string        `json:"id"`
	Name          core.MlString `json:"name"`
	Desc          core.MlString `json:"desc"`
	Price         float64       `json:"price"`
	OriginalPrice float64       `json:"originalPrice"`
	Quantity      int64         `json:"quantity"`
	Unit          string        `json:"unit"`
	Moq           int64         `json:"moq"`
	CutOffTime    string        `json:"cutOffTime"`
	Tags          []string      `json:"tags"`
	Img           string        `json:"img"`
	Status        string        `json:"status"`
	IsDeleted     bool          `json:"isDeleted"`
	CreatedAt     string        `json:"createdAt"`
	UpdatedAt     string        `json:"updatedAt"`
	Version       int           `json:"version"`
}

func NewProduct(p *product.Product) Product {
	return Product{
		Id:            p.GetId().String(),
		Name:          p.GetName(),
		Desc:          p.GetDesc(),
		Price:         p.GetPrice(),
		OriginalPrice: p.GetOriginalPrice(),
		Quantity:      p.GetQuantity(),
		Unit:          p.GetUnit().String(),
		Moq:           p.GetMoq(),
		CutOffTime:    p.GetCutOffTime(),
		Tags:          p.GetTags(),
		Img:           p.GetImg(),
		Status:        p.GetStatus().String(),
		IsDeleted:     p.GetIsDeleted(),
		CreatedAt:     p.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt:     p.GetUpdatedAt().Format(time.RFC3339),
		Version:       p.GetVersion(),
	}
}

type ProductsData struct {
	Products []Product `json:"products"`
	Count    int64     `json:"count"`
}

func NewProducts(products []*product.Product, count int64) ProductsData {
	var ps []Product
	for _, p := range products {
		ps = append(ps, NewProduct(p))
	}
	return ProductsData{Products: ps, Count: count}
}

// GetProductsByFilters godoc
//
//	@Summary		Get products by filters
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Products
//	@Accept			json
//	@Produce		json
//	@Param			offset		query		int		false	"Offset"
//	@Param			limit		query		int		false	"Limit"
//	@Param			is_deleted	query		bool	false	"Is deleted"
//	@Success		200			{object}	response.Success{data=ProductsData}
//	@Failure		default		{object}	response.Error
//	@Router			/management/products [get]
func (hd *HttpDelivery) GetProductsByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	products, count, err := hd.service.GetProductsByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewProducts(products, count))
}

// GetProductById godoc
//
//	@Summary		Get product by id
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Products
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=Product}
//	@Failure		default	{object}	response.Error
//	@Router			/management/products/{product_id} [get]
func (hd *HttpDelivery) GetProductById(w http.ResponseWriter, r *http.Request) {
	productId := chi.URLParam(r, "product_id")
	p, err := hd.service.GetProductById(r.Context(), productId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewProduct(p))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type AddProductIn struct {
	Name          core.MlString `json:"name"`
	Desc          core.MlString `json:"desc"`
	Price         float64       `json:"price"`
	OriginalPrice float64       `json:"originalPrice"`
	Quantity      int64         `json:"quantity"`
	Unit          string        `json:"unit"`
	Moq           int64         `json:"moq"`
	CutOffTime    string        `json:"cutOffTime"`
	Tags          []string      `json:"tags"`
	Img           string        `json:"img"`
	Status        string        `json:"status"`
}

// AddProduct godoc
//
//	@Summary		Add product
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Products
//	@Accept			json
//	@Produce		json
//	@Param			data	body		AddProductIn	true	"New product object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/products [post]
func (hd *HttpDelivery) AddProduct(w http.ResponseWriter, r *http.Request) {
	in := AddProductIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.AddProduct(r.Context(), in.Name, in.Desc, in.Price, in.OriginalPrice, in.Quantity, in.Unit, in.Moq, in.CutOffTime, in.Tags, in.Img, in.Status); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateProductIn struct {
	Name          core.MlString `json:"name"`
	Desc          core.MlString `json:"desc"`
	Price         float64       `json:"price"`
	OriginalPrice float64       `json:"originalPrice"`
	Quantity      int64         `json:"quantity"`
	Unit          string        `json:"unit"`
	Moq           int64         `json:"moq"`
	CutOffTime    string        `json:"cutOffTime"`
	Tags          []string      `json:"tags"`
	Img           string        `json:"img"`
	Status        string        `json:"status"`
}

// UpdateProduct godoc
//
//	@Summary		Update product
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Products
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateProductIn	true	"Update product object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/products/{product_id} [put]
func (hd *HttpDelivery) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	productId := chi.URLParam(r, "product_id")
	in := UpdateProductIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateProduct(r.Context(), productId, in.Name, in.Desc, in.Price, in.OriginalPrice, in.Quantity, in.Unit, in.Moq, in.CutOffTime, in.Tags, in.Img, in.Status); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// RecoverProduct godoc
//
//	@Summary		Recover product
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Products
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/products/recover/{product_id} [put]
func (hd *HttpDelivery) RecoverProduct(w http.ResponseWriter, r *http.Request) {
	productId := chi.URLParam(r, "product_id")
	if err := hd.service.RecoverProduct(r.Context(), productId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteProduct godoc
//
//	@Summary		Delete product
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Products
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/products/{product_id} [delete]
func (hd *HttpDelivery) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	productId := chi.URLParam(r, "product_id")
	if err := hd.service.DeleteProduct(r.Context(), productId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
