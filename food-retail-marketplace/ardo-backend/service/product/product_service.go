package product

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product"
	"github/nnniyaz/ardo/domain/product/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type ProductService interface {
	GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*product.Product, int64, error)
	GetById(ctx context.Context, productId string) (*product.Product, error)
	Create(ctx context.Context, product *product.Product) error
	Update(ctx context.Context, product *product.Product, name, desc core.MlString, price float64, quantity int, img, status string) error
	Recover(ctx context.Context, productId string) error
	Delete(ctx context.Context, productId string) error
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

func (p *productService) GetById(ctx context.Context, productId string) (*product.Product, error) {
	convertedId, err := uuid.UUIDFromString(productId)
	if err != nil {
		return nil, err
	}
	return p.productRepo.FindOneById(ctx, convertedId)
}

func (p *productService) Create(ctx context.Context, newProduct *product.Product) error {
	return p.productRepo.Create(ctx, newProduct)
}

func (p *productService) Update(ctx context.Context, product *product.Product, name, desc core.MlString, price float64, quantity int, img, status string) error {
	err := product.Update(name, desc, price, quantity, img, status)
	if err != nil {
		return err
	}
	return p.productRepo.Update(ctx, product)
}

func (p *productService) Recover(ctx context.Context, productId string) error {
	foundProduct, err := p.GetById(ctx, productId)
	if err != nil {
		return err
	}
	if !foundProduct.GetIsDeleted() {
		return exceptions.ErrProductAlreadyExist
	}
	return p.productRepo.Recover(ctx, foundProduct.GetId())
}

func (p *productService) Delete(ctx context.Context, productId string) error {
	foundProduct, err := p.GetById(ctx, productId)
	if err != nil {
		return err
	}
	if foundProduct.GetIsDeleted() {
		return exceptions.ErrProductNotFound
	}
	return p.productRepo.Delete(ctx, foundProduct.GetId())
}
