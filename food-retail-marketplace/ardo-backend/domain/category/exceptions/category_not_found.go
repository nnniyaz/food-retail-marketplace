package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrCategoryNotFound = core.NewI18NError(core.EINVALID, core.TXT_CATEGORY_NOT_FOUND)
