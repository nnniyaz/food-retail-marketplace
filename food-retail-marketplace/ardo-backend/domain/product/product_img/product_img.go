package product_img

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrInvalidImgUrl = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_IMG_URL)
)

type ProductImg struct {
	productId base.UUID
	url       string
}

func NewProductImg(productId base.UUID, url string) (*ProductImg, error) {
	if url == "" {
		return nil, ErrInvalidImgUrl
	}
	return &ProductImg{productId: productId, url: url}, nil
}

func (p *ProductImg) GetProductId() base.UUID {
	return p.productId
}

func (p *ProductImg) GetUrl() string {
	return p.url
}

func UnmarshalProductImgFromDatabase(productId base.UUID, url string) (*ProductImg, error) {
	if url == "" {
		return nil, ErrInvalidImgUrl
	}
	return &ProductImg{productId: productId, url: url}, nil
}
