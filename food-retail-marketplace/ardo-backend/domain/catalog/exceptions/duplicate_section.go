package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrDuplicateSection = core.NewI18NError(core.EINVALID, core.TXT_DUPLICATE_SECTION)
