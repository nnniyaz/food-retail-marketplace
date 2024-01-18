package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrProductAlreadyExist = core.NewI18NError(core.ECONFLICT, core.TXT_PRODUCT_ALREADY_EXISTS)
