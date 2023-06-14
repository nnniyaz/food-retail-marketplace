package exception

import "github/nnniyaz/ardo/pkg/core"

var ErrUserSessionNotFound = core.NewI18NError(core.ENOTFOUND, core.TXT_USER_SESSION_NOT_FOUND)
