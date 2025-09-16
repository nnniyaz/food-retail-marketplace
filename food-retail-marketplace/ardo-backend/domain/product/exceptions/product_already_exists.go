package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrProductAlreadyExist = core.NewI18NError(core.EINVALID, core.TXT_PRODUCT_ALREADY_EXISTS)
