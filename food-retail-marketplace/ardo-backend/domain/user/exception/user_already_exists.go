package exception

import "github/nnniyaz/ardo/pkg/core"

var ErrUserAlreadyExists = core.NewI18NError(core.ECONFLICT, core.TXT_USER_ALREADY_EXISTS)
