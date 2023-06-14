package exception

import "github/nnniyaz/ardo/pkg/core"

var ErrUserSessionAlreadyExists = core.NewI18NError(core.ECONFLICT, core.TXT_USER_SESSION_ALREADY_EXISTS)
