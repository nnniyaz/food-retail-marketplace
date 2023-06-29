package section_name

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type SectionName struct {
	sectionId uuid.UUID
	name      core.MlString
}

func NewSectionName(sectionId uuid.UUID, name core.MlString) (*SectionName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &SectionName{
		sectionId: sectionId,
		name:      name,
	}, nil
}

func (s *SectionName) GetSectionId() uuid.UUID {
	return s.sectionId
}

func (s *SectionName) GetName() core.MlString {
	return s.name
}

func UnmarshalSectionNameFromDatabase(sectionId uuid.UUID, name core.MlString) (*SectionName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &SectionName{
		sectionId: sectionId,
		name:      name,
	}, nil
}
