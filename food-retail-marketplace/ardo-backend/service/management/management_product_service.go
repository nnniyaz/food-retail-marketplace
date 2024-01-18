package management

import (
	"context"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	productService "github/nnniyaz/ardo/service/product"
)

type ManagementProductService interface {
	GetProductsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error)
	GetProductById(ctx context.Context, productId string) (*product.Product, error)
	AddProduct(ctx context.Context, name, desc core.MlString, price float64, quantity int, img, status string) error
	UpdateProduct(ctx context.Context, product *product.Product) error
	DeleteProduct(ctx context.Context, productId string) error
	RecoverProduct(ctx context.Context, productId string) error
}

type managementProductService struct {
	productService productService.ProductService
	logger         logger.Logger
}

func NewManagementProductService(productService productService.ProductService, l logger.Logger) ManagementProductService {
	return &managementProductService{productService: productService, logger: l}
}

func (m *managementProductService) GetProductsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error) {
	products, count, err := m.productService.GetByFilters(ctx, offset, limit, isDeleted)
	if err != nil {
		return nil, 0, err
	}
	return products, count, nil
}

func (m *managementProductService) GetProductById(ctx context.Context, productId string) (*product.Product, error) {
	return m.productService.GetById(ctx, productId)
}

func (m *managementProductService) AddProduct(ctx context.Context, name, desc core.MlString, price float64, quantity int, img, status string) error {
	err := m.productService.Create(ctx, name, desc, price, quantity, img, status)
	return err
}

func (m *managementProductService) UpdateProduct(ctx context.Context, product *product.Product) error {
	return m.productService.Update(ctx, product)
}

func (m *managementProductService) DeleteProduct(ctx context.Context, productId string) error {
	return m.productService.Delete(ctx, productId)
}

func (m *managementProductService) RecoverProduct(ctx context.Context, productId string) error {
	return m.productService.Recover(ctx, productId)
}
