package product

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type ProductService interface {
	GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error)
	GetById(ctx context.Context, id string) (*product.Product, error)
	Create(ctx context.Context, name, desc core.MlString, price float64, quantity int, img, status string) error
	Update(ctx context.Context, product *product.Product) error
	Delete(ctx context.Context, id string) error
	Recover(ctx context.Context, id string) error
}

type productService struct {
	productRepo repo.Product
	logger      logger.Logger
}

func NewProductService(repo repo.Product, l logger.Logger) ProductService {
	return &productService{productRepo: repo, logger: l}
}

func (p *productService) GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return p.productRepo.FindByFilters(ctx, offset, limit, isDeleted)
}

func (p *productService) GetById(ctx context.Context, id string) (*product.Product, error) {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return nil, err
	}
	return p.productRepo.FindOneById(ctx, convertedId)
}

func (p *productService) Create(ctx context.Context, name, desc core.MlString, price float64, quantity int, img, status string) error {
	newProduct, err := product.NewProduct(name, desc, price, quantity, img, status)
	if err != nil {
		return err
	}
	return p.productRepo.Create(ctx, newProduct)
}

func (p *productService) Update(ctx context.Context, product *product.Product) error {
	return p.productRepo.Update(ctx, product)
}

func (p *productService) Delete(ctx context.Context, id string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	return p.productRepo.Delete(ctx, convertedId)
}

func (p *productService) Recover(ctx context.Context, id string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	return p.productRepo.Recover(ctx, convertedId)
}
