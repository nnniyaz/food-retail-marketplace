package product_img

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrInvalidImgUrl = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_IMG_URL)
)

type ProductImg struct {
	productId uuid.UUID
	url       string
}

func NewProductImg(productId uuid.UUID, url string) (*ProductImg, error) {
	if url == "" {
		return nil, ErrInvalidImgUrl
	}
	return &ProductImg{productId: productId, url: url}, nil
}

func (p *ProductImg) GetProductId() uuid.UUID {
	return p.productId
}

func (p *ProductImg) GetUrl() string {
	return p.url
}

func UnmarshalProductImgFromDatabase(productId uuid.UUID, url string) (*ProductImg, error) {
	if url == "" {
		return nil, ErrInvalidImgUrl
	}
	return &ProductImg{productId: productId, url: url}, nil
}
