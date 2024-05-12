package valueobject

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidProductUnit = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_UNIT)
)

type ProductUnit string

const (
	PC ProductUnit = "pc"
	KG ProductUnit = "kg"
	LB ProductUnit = "lb"
)

func NewProductUnit(unit string) (ProductUnit, error) {
	convertedUnit := ProductUnit(unit)
	switch convertedUnit {
	case PC, KG, LB:
		return convertedUnit, nil
	}
	return "", ErrInvalidProductUnit
}

func (p ProductUnit) String() string {
	return string(p)
}
