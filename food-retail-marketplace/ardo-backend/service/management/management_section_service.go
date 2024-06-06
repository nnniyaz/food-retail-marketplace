package management

import (
	"context"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	sectionService "github/nnniyaz/ardo/service/section"
)

type ManagementSectionService interface {
	GetSectionsByFilters(ctx context.Context, offset, limit int64, isDeleted bool, search string) ([]*section.Section, int64, error)
	GetSectionById(ctx context.Context, sectionId string) (*section.Section, error)
	CreateSection(ctx context.Context, name core.MlString, img string) error
	UpdateSection(ctx context.Context, sectionId string, name core.MlString, img string) error
	RecoverSection(ctx context.Context, sectionId string) error
	DeleteSection(ctx context.Context, sectionId string) error
}

type managementSectionService struct {
	logger         logger.Logger
	sectionService sectionService.SectionService
}

func NewManagementSectionService(l logger.Logger, sectionService sectionService.SectionService) ManagementSectionService {
	return &managementSectionService{logger: l, sectionService: sectionService}
}

func (m *managementSectionService) GetSectionsByFilters(ctx context.Context, offset, limit int64, isDeleted bool, search string) ([]*section.Section, int64, error) {
	sections, count, err := m.sectionService.GetAllByFilters(ctx, offset, limit, isDeleted, search)
	if err != nil {
		return nil, 0, err
	}
	return sections, count, nil
}

func (m *managementSectionService) GetSectionById(ctx context.Context, sectionId string) (*section.Section, error) {
	return m.sectionService.GetOneById(ctx, sectionId)
}

func (m *managementSectionService) CreateSection(ctx context.Context, name core.MlString, img string) error {
	newSection, err := section.NewSection(name, img)
	if err != nil {
		return err
	}
	return m.sectionService.Create(ctx, newSection)
}

func (m *managementSectionService) UpdateSection(ctx context.Context, sectionId string, name core.MlString, img string) error {
	foundSection, err := m.sectionService.GetOneById(ctx, sectionId)
	if err != nil {
		return err
	}
	return m.sectionService.Update(ctx, foundSection, name, img)
}

func (m *managementSectionService) RecoverSection(ctx context.Context, sectionId string) error {
	return m.sectionService.Recover(ctx, sectionId)
}

func (m *managementSectionService) DeleteSection(ctx context.Context, sectionId string) error {
	return m.sectionService.Delete(ctx, sectionId)
}
