package category_name

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type CategoryName struct {
	categoryId base.UUID
	name       core.MlString
}

func NewCategoryName(categoryId base.UUID, name core.MlString) (*CategoryName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &CategoryName{
		categoryId: categoryId,
		name:       name,
	}, nil
}

func (c *CategoryName) GetCategoryId() base.UUID {
	return c.categoryId
}

func (c *CategoryName) GetName() core.MlString {
	return c.name
}

func UnmarshalCategoryNameFromDatabase(categoryId base.UUID, name core.MlString) (*CategoryName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &CategoryName{
		categoryId: categoryId,
		name:       name,
	}, nil
}
