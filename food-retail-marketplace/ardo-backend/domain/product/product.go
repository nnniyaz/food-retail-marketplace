package product

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product/exceptions"
	"github/nnniyaz/ardo/domain/product/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
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
		return nil, exceptions.ErrEmptyProductName
	}

	if price < 0 {
		return nil, exceptions.ErrInvalidProductPrice
	}

	if quantity < 0 {
		return nil, exceptions.ErrInvalidProductQuantity
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

func (p *Product) GetIsDeleted() bool {
	return p.isDeleted
}

func (p *Product) GetCreatedAt() time.Time {
	return p.createdAt
}

func (p *Product) GetUpdatedAt() time.Time {
	return p.updatedAt
}

func (p *Product) Update(name, desc core.MlString, price float64, quantity int, img, status string) error {
	if name.IsEmpty() {
		return core.ErrEmptyMlString
	}

	if price < 0 {
		return exceptions.ErrInvalidProductPrice
	}

	if quantity < 0 {
		return exceptions.ErrInvalidProductQuantity
	}

	productStatus, err := valueobject.NewProductStatus(status)
	if err != nil {
		return err
	}

	p.name = name
	p.desc = desc
	p.price = price
	p.quantity = quantity
	p.img = img
	p.status = productStatus
	p.updatedAt = time.Now()
	return nil
}

func UnmarshalProductFromDatabase(id uuid.UUID, name, desc core.MlString, price float64, quantity int, img string, status string, isDeleted bool, createdAt, updatedAt time.Time) *Product {
	return &Product{
		id:        id,
		name:      name,
		desc:      desc,
		price:     price,
		quantity:  quantity,
		img:       img,
		status:    valueobject.ProductStatus(status),
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
