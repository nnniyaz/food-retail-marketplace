package category

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/category/exceptions"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

type Category struct {
	id        uuid.UUID
	name      core.MlString
	desc      core.MlString
	img       string
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
	version   int
}

func NewCategory(name, desc core.MlString, img string) (*Category, error) {
	if name.IsEmpty() {
		return nil, exceptions.ErrEmptyCategoryName
	}
	return &Category{
		id:        uuid.NewUUID(),
		name:      name,
		desc:      desc,
		img:       img,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
		version:   1,
	}, nil
}

func (c *Category) GetId() uuid.UUID {
	return c.id
}

func (c *Category) GetName() core.MlString {
	return c.name
}

func (c *Category) GetDesc() core.MlString {
	return c.desc
}

func (c *Category) GetImg() string {
	return c.img
}

func (c *Category) GetIsDeleted() bool {
	return c.isDeleted
}

func (c *Category) GetCreatedAt() time.Time {
	return c.createdAt
}

func (c *Category) GetUpdatedAt() time.Time {
	return c.updatedAt
}

func (c *Category) GetVersion() int {
	return c.version
}

func (c *Category) Update(name, desc core.MlString, img string) error {
	if name.IsEmpty() {
		return exceptions.ErrEmptyCategoryName
	}
	c.name = name
	c.desc = desc
	c.img = img
	c.updatedAt = time.Now()
	c.version++
	return nil
}

func UnmarshalCategoryFromDatabase(id uuid.UUID, name, desc core.MlString, img string, isDeleted bool, createdAt, updatedAt time.Time, version int) *Category {
	return &Category{
		id:        id,
		name:      name,
		desc:      desc,
		img:       img,
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
		version:   version,
	}
}
