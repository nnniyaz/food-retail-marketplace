package product_name

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type ProductName struct {
	productId base.UUID
	name      core.MlString
}

func NewProductName(productId base.UUID, name core.MlString) (*ProductName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &ProductName{productId: productId, name: name}, nil
}

func (p *ProductName) GetProductId() base.UUID {
	return p.productId
}

func (p *ProductName) GetName() core.MlString {
	return p.name
}

func UnmarshalProductNameFromDatabase(productId base.UUID, name core.MlString) (*ProductName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &ProductName{productId: productId, name: name}, nil
}
