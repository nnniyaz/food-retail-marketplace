package section

import (
	"github/nnniyaz/ardo/domain/base"
	"time"
)

type Section struct {
	id         base.UUID
	imgUrl     string
	isDeleted  bool
	isDisabled bool
	createdAt  time.Time
	updatedAt  time.Time
}

func NewSection(id base.UUID, imgUrl string) *Section {
	return &Section{
		id:         base.NewUUID(),
		imgUrl:     imgUrl,
		isDeleted:  false,
		isDisabled: false,
		createdAt:  time.Now(),
		updatedAt:  time.Now(),
	}
}

func (s *Section) GetId() base.UUID {
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

func UnmarshalSectionFromDatabase(id base.UUID, imgUrl string, isDeleted, isDisabled bool, createdAt, updatedAt time.Time) *Section {
	return &Section{
		id:         id,
		imgUrl:     imgUrl,
		isDeleted:  isDeleted,
		isDisabled: isDisabled,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}
}
