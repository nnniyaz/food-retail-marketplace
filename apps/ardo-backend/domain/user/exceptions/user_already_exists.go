package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrUserAlreadyExist = core.NewI18NError(core.EINVALID, core.TXT_USER_ALREADY_EXISTS)
