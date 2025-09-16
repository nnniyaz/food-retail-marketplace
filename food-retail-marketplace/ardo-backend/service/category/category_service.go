package category

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/domain/category/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	repo "github/nnniyaz/ardo/repo"
)

type CategoryService interface {
	GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool, search string) ([]*category.Category, int64, error)
	GetOneById(ctx context.Context, categoryId string) (*category.Category, error)
	Create(ctx context.Context, category *category.Category) error
	Update(ctx context.Context, category *category.Category, name, desc core.MlString, img string) error
	Recover(ctx context.Context, categoryId string) error
	Delete(ctx context.Context, categoryId string) error
}

type categoryService struct {
	logger       logger.Logger
	categoryRepo repo.Category
}

func NewCategoryService(l logger.Logger, repo repo.Category) CategoryService {
	return &categoryService{logger: l, categoryRepo: repo}
}

func (c *categoryService) GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool, search string) ([]*category.Category, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return c.categoryRepo.FindByFilters(ctx, offset, limit, isDeleted, search)
}

func (c *categoryService) GetOneById(ctx context.Context, categoryId string) (*category.Category, error) {
	convertedId, err := uuid.UUIDFromString(categoryId)
	if err != nil {
		return nil, err
	}
	return c.categoryRepo.FindOneById(ctx, convertedId)
}

func (c *categoryService) Create(ctx context.Context, category *category.Category) error {
	return c.categoryRepo.Create(ctx, category)
}

func (c *categoryService) Update(ctx context.Context, category *category.Category, name, desc core.MlString, img string) error {
	if err := category.Update(name, desc, img); err != nil {
		return err
	}
	return c.categoryRepo.Update(ctx, category)
}

func (c *categoryService) Recover(ctx context.Context, categoryId string) error {
	foundCategory, err := c.GetOneById(ctx, categoryId)
	if err != nil {
		return err
	}
	if !foundCategory.GetIsDeleted() {
		return exceptions.ErrCategoryAlreadyExist
	}
	return c.categoryRepo.Recover(ctx, foundCategory.GetId())
}

func (c *categoryService) Delete(ctx context.Context, categoryId string) error {
	foundCategory, err := c.GetOneById(ctx, categoryId)
	if err != nil {
		return err
	}
	if foundCategory.GetIsDeleted() {
		return exceptions.ErrCategoryNotFound
	}
	return c.categoryRepo.Delete(ctx, foundCategory.GetId())
}
