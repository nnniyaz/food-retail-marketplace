package product_name

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type ProductName struct {
	productId uuid.UUID
	name      core.MlString
}

func NewProductName(productId uuid.UUID, name core.MlString) (*ProductName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &ProductName{productId: productId, name: name}, nil
}

func (p *ProductName) GetProductId() uuid.UUID {
	return p.productId
}

func (p *ProductName) GetName() core.MlString {
	return p.name
}

func UnmarshalProductNameFromDatabase(productId uuid.UUID, name core.MlString) (*ProductName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &ProductName{productId: productId, name: name}, nil
}
