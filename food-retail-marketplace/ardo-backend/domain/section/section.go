package section

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"time"
)

type Section struct {
	id         uuid.UUID
	imgUrl     string
	isDeleted  bool
	isDisabled bool
	createdAt  time.Time
	updatedAt  time.Time
}

func NewSection(id uuid.UUID, imgUrl string) *Section {
	return &Section{
		id:         id.NewUUID(),
		imgUrl:     imgUrl,
		isDeleted:  false,
		isDisabled: false,
		createdAt:  time.Now(),
		updatedAt:  time.Now(),
	}
}

func (s *Section) GetId() uuid.UUID {
	return s.id
}

func (s *Section) GetImgUrl() string {
	return s.imgUrl
}

func (s *Section) GetIsDeleted() bool {
	return s.isDeleted
}

func (s *Section) GetIsDisabled() bool {
	return s.isDisabled
}

func (s *Section) GetCreatedAt() time.Time {
	return s.createdAt
}

func (s *Section) GetUpdatedAt() time.Time {
	return s.updatedAt
}

func UnmarshalSectionFromDatabase(id uuid.UUID, imgUrl string, isDeleted, isDisabled bool, createdAt, updatedAt time.Time) *Section {
	return &Section{
		id:         id,
		imgUrl:     imgUrl,
		isDeleted:  isDeleted,
		isDisabled: isDisabled,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}
}
