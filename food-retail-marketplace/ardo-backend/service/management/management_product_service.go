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
	AddProduct(ctx context.Context, name, desc core.MlString, price float64, quantity int64, img, status string) error
	UpdateProduct(ctx context.Context, productId string, name, desc core.MlString, price float64, quantity int64, img, status string) error
	DeleteProduct(ctx context.Context, productId string) error
	RecoverProduct(ctx context.Context, productId string) error
}

type managementProductService struct {
	logger         logger.Logger
	productService productService.ProductService
}

func NewManagementProductService(l logger.Logger, productService productService.ProductService) ManagementProductService {
	return &managementProductService{logger: l, productService: productService}
}

func (m *managementProductService) GetProductsByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error) {
	products, count, err := m.productService.GetAllByFilters(ctx, offset, limit, isDeleted)
	if err != nil {
		return nil, 0, err
	}
	return products, count, nil
}

func (m *managementProductService) GetProductById(ctx context.Context, productId string) (*product.Product, error) {
	return m.productService.GetOneById(ctx, productId)
}

func (m *managementProductService) AddProduct(ctx context.Context, name, desc core.MlString, price float64, quantity int64, img, status string) error {
	newProduct, err := product.NewProduct(name, desc, price, quantity, img, status)
	if err != nil {
		return err
	}
	return m.productService.Create(ctx, newProduct)
}

func (m *managementProductService) UpdateProduct(ctx context.Context, productId string, name, desc core.MlString, price float64, quantity int64, img, status string) error {
	foundProduct, err := m.productService.GetOneById(ctx, productId)
	if err != nil {
		return err
	}
	return m.productService.Update(ctx, foundProduct, name, desc, price, quantity, img, status)
}

func (m *managementProductService) RecoverProduct(ctx context.Context, productId string) error {
	return m.productService.Recover(ctx, productId)
}

func (m *managementProductService) DeleteProduct(ctx context.Context, productId string) error {
	return m.productService.Delete(ctx, productId)
}
