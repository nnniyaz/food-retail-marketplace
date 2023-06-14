package exception

import "github/nnniyaz/ardo/pkg/core"

var ErrUserNotFound = core.NewI18NError(core.ENOTFOUND, core.TXT_USER_NOT_FOUND)
