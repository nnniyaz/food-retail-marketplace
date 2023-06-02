package valueobject

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidCurrency = core.NewI18NError(core.EINVALID, core.TXT_INVALID_CURRENCY)
)

type Currency string

const (
	USD Currency = "USD"
	KZT Currency = "KZT"
	HKD Currency = "HKD"
)

func NewCurrency(currency string) (Currency, error) {
	convertedCurrency := Currency(currency)
	switch convertedCurrency {
	case USD, KZT, HKD:
		return convertedCurrency, nil
	}
	return "", ErrInvalidCurrency
}

func (c Currency) String() string {
	return string(c)
}
