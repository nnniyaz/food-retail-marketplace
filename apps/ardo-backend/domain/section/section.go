package section

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/section/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

type Section struct {
	id        uuid.UUID
	name      core.MlString
	img       string
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
	version   int
}

func NewSection(name core.MlString, img string) (*Section, error) {
	if name.IsEmpty() {
		return nil, exceptions.ErrEmptySectionName
	}
	return &Section{
		id:        uuid.NewUUID(),
		name:      name,
		img:       img,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
		version:   1,
	}, nil
}

func (s *Section) GetId() uuid.UUID {
	return s.id
}

func (s *Section) GetName() core.MlString {
	return s.name
}

func (s *Section) GetImg() string {
	return s.img
}

func (s *Section) GetIsDeleted() bool {
	return s.isDeleted
}

func (s *Section) GetCreatedAt() time.Time {
	return s.createdAt
}

func (s *Section) GetUpdatedAt() time.Time {
	return s.updatedAt
}

func (s *Section) GetVersion() int {
	return s.version
}

func (s *Section) Update(name core.MlString, img string) error {
	if name.IsEmpty() {
		return exceptions.ErrEmptySectionName
	}
	s.name = name
	s.img = img
	s.updatedAt = time.Now()
	s.version++
	return nil
}

func UnmarshalSectionFromDatabase(id uuid.UUID, name core.MlString, img string, isDeleted bool, createdAt time.Time, updatedAt time.Time, version int) *Section {
	return &Section{
		id:        id,
		name:      name,
		img:       img,
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
		version:   version,
	}
}
