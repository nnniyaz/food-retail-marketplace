package exceptions

import "github/nnniyaz/ardo/pkg/core"

var ErrCatalogNotFound = core.NewI18NError(core.EINVALID, core.TXT_CATALOG_NOT_FOUND)
