package management

import (
	"context"
	"github/nnniyaz/ardo/domain/category"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	categoryService "github/nnniyaz/ardo/service/category"
)

type ManagementCategoryService interface {
	GetCategoriesByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*category.Category, int64, error)
	GetCategoryById(ctx context.Context, categoryId string) (*category.Category, error)
	CreateCategory(ctx context.Context, name, desc core.MlString, img string) error
	UpdateCategory(ctx context.Context, categoryId string, name, desc core.MlString, img string) error
	RecoverCategory(ctx context.Context, categoryId string) error
	DeleteCategory(ctx context.Context, categoryId string) error
}

type managementCategoryService struct {
	logger          logger.Logger
	categoryService categoryService.CategoryService
}

func NewManagementCategoryService(l logger.Logger, categoryService categoryService.CategoryService) ManagementCategoryService {
	return &managementCategoryService{logger: l, categoryService: categoryService}
}

func (m *managementCategoryService) GetCategoriesByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*category.Category, int64, error) {
	categories, count, err := m.categoryService.GetAllByFilters(ctx, offset, limit, isDeleted)
	if err != nil {
		return nil, 0, err
	}
	return categories, count, nil
}

func (m *managementCategoryService) GetCategoryById(ctx context.Context, categoryId string) (*category.Category, error) {
	return m.categoryService.GetOneById(ctx, categoryId)
}

func (m *managementCategoryService) CreateCategory(ctx context.Context, name, desc core.MlString, img string) error {
	newCategory, err := category.NewCategory(name, desc, img)
	if err != nil {
		return err
	}
	return m.categoryService.Create(ctx, newCategory)
}

func (m *managementCategoryService) UpdateCategory(ctx context.Context, categoryId string, name, desc core.MlString, img string) error {
	foundCategory, err := m.categoryService.GetOneById(ctx, categoryId)
	if err != nil {
		return err
	}
	return m.categoryService.Update(ctx, foundCategory, name, desc, img)
}

func (m *managementCategoryService) RecoverCategory(ctx context.Context, categoryId string) error {
	return m.categoryService.Recover(ctx, categoryId)
}

func (m *managementCategoryService) DeleteCategory(ctx context.Context, categoryId string) error {
	return m.categoryService.Delete(ctx, categoryId)
}
