package management

import (
	"context"
	"github/nnniyaz/ardo/domain/slide"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	slideService "github/nnniyaz/ardo/service/slide"
)

type ManagementSlideService interface {
	GetSlidesByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*slide.Slide, int64, error)
	GetSlideById(ctx context.Context, slideId string) (*slide.Slide, error)
	CreateSlide(ctx context.Context, caption core.MlString, img string) error
	UpdateSlide(ctx context.Context, slideId string, caption core.MlString, img string) error
	RecoverSlide(ctx context.Context, slideId string) error
	DeleteSlide(ctx context.Context, slideId string) error
}

type managementSlideService struct {
	logger       logger.Logger
	slideService slideService.SlideService
}

func NewManagementSlideService(l logger.Logger, slideService slideService.SlideService) ManagementSlideService {
	return &managementSlideService{logger: l, slideService: slideService}
}

func (m *managementSlideService) GetSlidesByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*slide.Slide, int64, error) {
	slides, count, err := m.slideService.GetAllByFilters(ctx, offset, limit, isDeleted)
	if err != nil {
		return nil, 0, err
	}
	return slides, count, nil
}

func (m *managementSlideService) GetSlideById(ctx context.Context, slideId string) (*slide.Slide, error) {
	return m.slideService.GetOneById(ctx, slideId)
}

func (m *managementSlideService) CreateSlide(ctx context.Context, caption core.MlString, img string) error {
	newSection, err := slide.NewSlide(caption, img)
	if err != nil {
		return err
	}
	return m.slideService.Create(ctx, newSection)
}

func (m *managementSlideService) UpdateSlide(ctx context.Context, slideId string, caption core.MlString, img string) error {
	foundSection, err := m.slideService.GetOneById(ctx, slideId)
	if err != nil {
		return err
	}
	return m.slideService.Update(ctx, foundSection, caption, img)
}

func (m *managementSlideService) RecoverSlide(ctx context.Context, slideId string) error {
	return m.slideService.Recover(ctx, slideId)
}

func (m *managementSlideService) DeleteSlide(ctx context.Context, slideId string) error {
	return m.slideService.Delete(ctx, slideId)
}
