package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrEmptyCategoryName = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_CATEGORY_NAME)
