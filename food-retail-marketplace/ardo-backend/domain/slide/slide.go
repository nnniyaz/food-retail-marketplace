package slide

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/slide/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

type Slide struct {
	id        uuid.UUID
	caption   core.MlString
	img       string
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
	version   int
}

func NewSlide(caption core.MlString, img string) (*Slide, error) {
	if img == "" {
		return nil, exceptions.ErrEmptySlideImg
	}
	return &Slide{
		id:        uuid.NewUUID(),
		caption:   caption,
		img:       img,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
		version:   1,
	}, nil
}

func (s *Slide) GetId() uuid.UUID {
	return s.id
}

func (s *Slide) GetCaption() core.MlString {
	return s.caption
}

func (s *Slide) GetImg() string {
	return s.img
}

func (s *Slide) GetIsDeleted() bool {
	return s.isDeleted
}

func (s *Slide) GetCreatedAt() time.Time {
	return s.createdAt
}

func (s *Slide) GetUpdatedAt() time.Time {
	return s.updatedAt
}

func (s *Slide) GetVersion() int {
	return s.version
}

func (s *Slide) Update(caption core.MlString, img string) error {
	if img == "" {
		return exceptions.ErrEmptySlideImg
	}
	s.caption = caption
	s.img = img
	s.updatedAt = time.Now()
	s.version++
	return nil
}

func UnmarshalSlideFromDatabase(id uuid.UUID, caption core.MlString, img string, isDeleted bool, createdAt time.Time, updatedAt time.Time, version int) *Slide {
	return &Slide{
		id:        id,
		caption:   caption,
		img:       img,
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
		version:   version,
	}
}
