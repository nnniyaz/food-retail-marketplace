package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrSectionNotFound = core.NewI18NError(core.EINVALID, core.TXT_SECTION_NOT_FOUND)
