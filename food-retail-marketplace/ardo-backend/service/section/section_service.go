package section

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/domain/section/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type SectionService interface {
	GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*section.Section, int64, error)
	GetOneById(ctx context.Context, sectionId string) (*section.Section, error)
	Create(ctx context.Context, section *section.Section) error
	Update(ctx context.Context, section *section.Section, name core.MlString, img string) error
	Recover(ctx context.Context, sectionId string) error
	Delete(ctx context.Context, sectionId string) error
}

type sectionService struct {
	logger      logger.Logger
	sectionRepo repo.Section
}

func NewSectionService(l logger.Logger, repo repo.Section) SectionService {
	return &sectionService{logger: l, sectionRepo: repo}
}

func (s *sectionService) GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*section.Section, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return s.sectionRepo.FindByFilters(ctx, offset, limit, isDeleted)
}

func (s *sectionService) GetOneById(ctx context.Context, sectionId string) (*section.Section, error) {
	convertedId, err := uuid.UUIDFromString(sectionId)
	if err != nil {
		return nil, err
	}
	return s.sectionRepo.FindOneById(ctx, convertedId)
}

func (s *sectionService) Create(ctx context.Context, section *section.Section) error {
	return s.sectionRepo.Create(ctx, section)
}

func (s *sectionService) Update(ctx context.Context, section *section.Section, name core.MlString, img string) error {
	if err := section.Update(name, img); err != nil {
		return err
	}
	return s.sectionRepo.Update(ctx, section)
}

func (s *sectionService) Recover(ctx context.Context, sectionId string) error {
	foundSection, err := s.GetOneById(ctx, sectionId)
	if err != nil {
		return err
	}
	if !foundSection.GetIsDeleted() {
		return exceptions.ErrSectionAlreadyExist
	}
	return s.sectionRepo.Recover(ctx, foundSection.GetId())
}

func (s *sectionService) Delete(ctx context.Context, sectionId string) error {
	foundSection, err := s.GetOneById(ctx, sectionId)
	if err != nil {
		return err
	}
	if foundSection.GetIsDeleted() {
		return exceptions.ErrSectionNotFound
	}
	return s.sectionRepo.Delete(ctx, foundSection.GetId())
}
