package exceptions

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrSamePassword = core.NewI18NError(core.EINVALID, core.TXT_SAME_PASSWORD)
)
