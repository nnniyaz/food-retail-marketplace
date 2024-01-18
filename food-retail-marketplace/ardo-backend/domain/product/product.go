package product

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

var (
	ErrEmptyMlString   = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
	ErrInvalidPrice    = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_PRICE)
	ErrInvalidQuantity = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_QUANTITY)
)

type Product struct {
	id        uuid.UUID
	name      core.MlString
	desc      core.MlString
	price     float64
	quantity  int
	img       string
	status    valueobject.ProductStatus
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
}

func NewProduct(name, desc core.MlString, price float64, quantity int, img, status string) (*Product, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}

	if price < 0 {
		return nil, ErrInvalidPrice
	}

	if quantity < 0 {
		return nil, ErrInvalidQuantity
	}

	productStatus, err := valueobject.NewProductStatus(status)
	if err != nil {
		return nil, err
	}

	return &Product{
		id:        uuid.NewUUID(),
		name:      name,
		desc:      desc,
		price:     price,
		quantity:  quantity,
		img:       img,
		status:    productStatus,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (p *Product) GetId() uuid.UUID {
	return p.id
}

func (p *Product) GetName() core.MlString {
	return p.name
}

func (p *Product) GetDesc() core.MlString {
	return p.desc
}

func (p *Product) GetPrice() float64 {
	return p.price
}

func (p *Product) GetQuantity() int {
	return p.quantity
}

func (p *Product) GetImg() string {
	return p.img
}

func (p *Product) GetStatus() valueobject.ProductStatus {
	return p.status
}

func (p *Product) IsDeleted() bool {
	return p.isDeleted
}

func (p *Product) GetCreatedAt() time.Time {
	return p.createdAt
}

func (p *Product) GetUpdatedAt() time.Time {
	return p.updatedAt
}

func UnmarshalProductFromDatabase(id uuid.UUID, name, desc core.MlString, price float64, quantity int, img string, status string, isDeleted bool, createdAt, updatedAt time.Time) (*Product, error) {
	productStatus, err := valueobject.NewProductStatus(status)
	if err != nil {
		return nil, err
	}

	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}

	if price < 0 {
		return nil, ErrInvalidPrice
	}

	if quantity < 0 {
		return nil, ErrInvalidQuantity
	}

	return &Product{
		id:        id,
		name:      name,
		desc:      desc,
		price:     price,
		quantity:  quantity,
		img:       img,
		status:    productStatus,
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}, nil
}
