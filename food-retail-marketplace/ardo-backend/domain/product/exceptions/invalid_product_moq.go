package exceptions

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidProductMoq = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_MOQ)
)
