package exceptions

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidOrderPrice = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ORDER_PRICE)
)
