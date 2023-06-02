package category

import (
	"github/nnniyaz/ardo/domain/base"
	"time"
)

type Category struct {
	id         base.UUID
	sectionId  base.UUID
	imgUrl     string
	isDeleted  bool
	isDisabled bool
	createdAt  time.Time
	updatedAt  time.Time
}

func NewCategory(sectionId base.UUID, imgUrl string) *Category {
	return &Category{
		id:         base.NewUUID(),
		sectionId:  sectionId,
		imgUrl:     imgUrl,
		isDeleted:  false,
		isDisabled: false,
		createdAt:  time.Now(),
		updatedAt:  time.Now(),
	}
}

func (c *Category) GetId() base.UUID {
	return c.id
}

func (c *Category) GetSectionId() base.UUID {
	return c.sectionId
}

func (c *Category) GetImgUrl() string {
	return c.imgUrl
}

func (c *Category) GetIsDeleted() bool {
	return c.isDeleted
}

func (c *Category) GetIsDisabled() bool {
	return c.isDisabled
}

func (c *Category) GetCreatedAt() time.Time {
	return c.createdAt
}

func (c *Category) GetUpdatedAt() time.Time {
	return c.updatedAt
}

func UnmarshalCategoryFromDatabase(id, sectionId base.UUID, imgUrl string, isDeleted, isDisabled bool, createdAt, updatedAt time.Time) *Category {
	return &Category{
		id:         id,
		sectionId:  sectionId,
		imgUrl:     imgUrl,
		isDeleted:  isDeleted,
		isDisabled: isDisabled,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}
}
