package slide

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/slide"
	"github/nnniyaz/ardo/domain/slide/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type SlideService interface {
	GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*slide.Slide, int64, error)
	GetOneById(ctx context.Context, slideId string) (*slide.Slide, error)
	Create(ctx context.Context, slide *slide.Slide) error
	Update(ctx context.Context, slide *slide.Slide, caption core.MlString, img string) error
	Recover(ctx context.Context, slideId string) error
	Delete(ctx context.Context, slideId string) error
}

type slideService struct {
	logger    logger.Logger
	slideRepo repo.Slide
}

func NewSlideService(l logger.Logger, repo repo.Slide) SlideService {
	return &slideService{logger: l, slideRepo: repo}
}

func (s *slideService) GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*slide.Slide, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return s.slideRepo.FindByFilters(ctx, offset, limit, isDeleted)
}

func (s *slideService) GetOneById(ctx context.Context, slideId string) (*slide.Slide, error) {
	convertedId, err := uuid.UUIDFromString(slideId)
	if err != nil {
		return nil, err
	}
	return s.slideRepo.FindById(ctx, convertedId)
}

func (s *slideService) Create(ctx context.Context, slide *slide.Slide) error {
	return s.slideRepo.Create(ctx, slide)
}

func (s *slideService) Update(ctx context.Context, slide *slide.Slide, caption core.MlString, img string) error {
	if err := slide.Update(caption, img); err != nil {
		return err
	}
	return s.slideRepo.Update(ctx, slide)
}

func (s *slideService) Recover(ctx context.Context, slideId string) error {
	foundSlide, err := s.GetOneById(ctx, slideId)
	if err != nil {
		return err
	}
	if !foundSlide.GetIsDeleted() {
		return exceptions.ErrSlideAlreadyExist
	}
	return s.slideRepo.Recover(ctx, foundSlide.GetId())
}

func (s *slideService) Delete(ctx context.Context, slideId string) error {
	foundSlide, err := s.GetOneById(ctx, slideId)
	if err != nil {
		return err
	}
	if foundSlide.GetIsDeleted() {
		return exceptions.ErrSlideNotFound
	}
	return s.slideRepo.Delete(ctx, foundSlide.GetId())
}
