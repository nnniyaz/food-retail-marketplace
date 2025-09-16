package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrDuplicateProduct = core.NewI18NError(core.EINVALID, core.TXT_DUPLICATE_PRODUCT)
