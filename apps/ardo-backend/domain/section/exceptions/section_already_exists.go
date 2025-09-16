package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrSectionAlreadyExist = core.NewI18NError(core.EINVALID, core.TXT_SECTION_ALREADY_EXISTS)
