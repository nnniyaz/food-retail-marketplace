package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrEmptyProductName = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_PRODUCT_NAME)
