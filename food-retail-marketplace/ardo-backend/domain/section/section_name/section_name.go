package section_name

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type SectionName struct {
	sectionId base.UUID
	name      core.MlString
}

func NewSectionName(sectionId base.UUID, name core.MlString) (*SectionName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &SectionName{
		sectionId: sectionId,
		name:      name,
	}, nil
}

func (s *SectionName) GetSectionId() base.UUID {
	return s.sectionId
}

func (s *SectionName) GetName() core.MlString {
	return s.name
}

func UnmarshalSectionNameFromDatabase(sectionId base.UUID, name core.MlString) (*SectionName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &SectionName{
		sectionId: sectionId,
		name:      name,
	}, nil
}
