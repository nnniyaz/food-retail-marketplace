package valueobject

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidProductStatus = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_STATUS)
)

type ProductStatus string

const (
	ACTIVE  ProductStatus = "ACTIVE"
	ARCHIVE ProductStatus = "ARCHIVE"
)

func NewProductStatus(status string) (ProductStatus, error) {
	convertedStatus := ProductStatus(status)
	switch convertedStatus {
	case ACTIVE, ARCHIVE:
		return convertedStatus, nil
	}
	return "", ErrInvalidProductStatus
}
