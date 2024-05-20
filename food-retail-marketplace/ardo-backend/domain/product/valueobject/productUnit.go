package valueobject

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidProductUnit = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_UNIT)
)

type ProductUnit string

const (
	PC     ProductUnit = "pc"
	KG     ProductUnit = "kg"
	LB     ProductUnit = "lb"
	CASE   ProductUnit = "case"
	PUNNET ProductUnit = "punnet"
	PACK   ProductUnit = "pack"
)

func NewProductUnit(unit string) (ProductUnit, error) {
	convertedUnit := ProductUnit(unit)
	switch convertedUnit {
	case PC, KG, LB, CASE, PUNNET, PACK:
		return convertedUnit, nil
	}
	return "", ErrInvalidProductUnit
}

func (p ProductUnit) String() string {
	return string(p)
}
