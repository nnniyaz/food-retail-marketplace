package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrOrderNotFound = core.NewI18NError(core.EINVALID, core.TXT_ORDER_NOT_FOUND)
