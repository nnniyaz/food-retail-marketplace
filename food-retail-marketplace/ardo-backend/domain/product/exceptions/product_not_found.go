package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrProductNotFound = core.NewI18NError(core.EINVALID, core.TXT_PRODUCT_NOT_FOUND)
