package product_characteristic

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type ProductCharacteristic struct {
	productId base.UUID
	label     core.MlString
	value     core.MlString
}

func NewProductCharacteristic(productId base.UUID, label, value core.MlString) (*ProductCharacteristic, error) {
	if label.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	if value.IsEmpty() {
		return nil, ErrEmptyMlString
	}

	return &ProductCharacteristic{
		productId: productId,
		label:     label,
		value:     value,
	}, nil
}

func (p *ProductCharacteristic) GetProductId() base.UUID {
	return p.productId
}

func (p *ProductCharacteristic) GetLabel() core.MlString {
	return p.label
}

func (p *ProductCharacteristic) GetValue() core.MlString {
	return p.value
}

func UnmarshalProductCharacteristicFromDatabase(productId base.UUID, label, value core.MlString) (*ProductCharacteristic, error) {
	return &ProductCharacteristic{
		productId: productId,
		label:     label,
		value:     value,
	}, nil
}
