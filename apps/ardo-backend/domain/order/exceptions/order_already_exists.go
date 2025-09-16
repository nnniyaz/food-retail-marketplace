package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrOrderAlreadyExist = core.NewI18NError(core.EINVALID, core.TXT_ORDER_ALREADY_EXISTS)
