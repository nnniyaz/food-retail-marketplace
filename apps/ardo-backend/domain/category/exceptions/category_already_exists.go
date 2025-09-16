package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrCategoryAlreadyExist = core.NewI18NError(core.EINVALID, core.TXT_CATEGORY_ALREADY_EXISTS)
