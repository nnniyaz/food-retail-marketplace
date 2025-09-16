package currency

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrEmptyCurrency   = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_CURRENCY)
	ErrInvalidCurrency = core.NewI18NError(core.EINVALID, core.TXT_INVALID_CURRENCY)
)

type Currency string

const (
	HKD Currency = "HKD"
	KZT Currency = "KZT"
)

func NewCurrency(currency string) (Currency, error) {
	if currency == "" {
		return "", ErrEmptyCurrency
	}
	switch currency {
	case "HKD", "KZT":
		return Currency(currency), nil
	default:
		return "", ErrInvalidCurrency
	}
}

func (c Currency) String() string {
	return string(c)
}
