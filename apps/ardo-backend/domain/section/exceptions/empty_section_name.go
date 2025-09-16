package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrEmptySectionName = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_SECTION_NAME)
