package product_desc

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type ProductDesc struct {
	productId uuid.UUID
	desc      core.MlString
}

func NewProductDesc(productId uuid.UUID, desc core.MlString) (*ProductDesc, error) {
	if desc.IsEmpty() {
		return nil, ErrEmptyMlString
	}

	return &ProductDesc{
		productId: productId,
		desc:      desc,
	}, nil
}

func (p *ProductDesc) GetProductId() uuid.UUID {
	return p.productId
}

func (p *ProductDesc) GetDesc() core.MlString {
	return p.desc
}

func UnmarshalProductDescFromDatabase(productId uuid.UUID, desc core.MlString) (*ProductDesc, error) {
	return &ProductDesc{
		productId: productId,
		desc:      desc,
	}, nil
}
