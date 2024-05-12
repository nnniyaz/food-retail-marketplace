package product

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product/exceptions"
	"github/nnniyaz/ardo/domain/product/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

type Product struct {
	id            uuid.UUID
	name          core.MlString
	desc          core.MlString
	price         float64
	originalPrice float64
	quantity      int64
	unit          valueobject.ProductUnit
	tags          []string
	img           string
	status        valueobject.ProductStatus
	isDeleted     bool
	createdAt     time.Time
	updatedAt     time.Time
	version       int
}

func NewProduct(name, desc core.MlString, price, originalPrice float64, quantity int64, unit string, tags []string, img, status string) (*Product, error) {
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

	productUnit, err := valueobject.NewProductUnit(unit)
	if err != nil {
		return nil, err
	}

	return &Product{
		id:            uuid.NewUUID(),
		name:          name,
		desc:          desc,
		price:         price,
		originalPrice: originalPrice,
		quantity:      quantity,
		unit:          productUnit,
		tags:          tags,
		img:           img,
		status:        productStatus,
		isDeleted:     false,
		createdAt:     time.Now(),
		updatedAt:     time.Now(),
		version:       1,
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

func (p *Product) GetOriginalPrice() float64 {
	return p.originalPrice
}

func (p *Product) GetQuantity() int64 {
	return p.quantity
}

func (p *Product) GetUnit() valueobject.ProductUnit {
	return p.unit
}

func (p *Product) GetTags() []string {
	return p.tags
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

func (p *Product) GetVersion() int {
	return p.version
}

func (p *Product) Update(name, desc core.MlString, price, originalPrice float64, quantity int64, unit string, tags []string, img, status string) error {
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

	productUnit, err := valueobject.NewProductUnit(unit)
	if err != nil {
		return err
	}

	p.name = name
	p.desc = desc
	p.price = price
	p.originalPrice = originalPrice
	p.quantity = quantity
	p.unit = productUnit
	p.tags = tags
	p.img = img
	p.status = productStatus
	p.updatedAt = time.Now()
	p.version++
	return nil
}

func UnmarshalProductFromDatabase(id uuid.UUID, name, desc core.MlString, price, originalPrice float64, quantity int64, unit string, tags []string, img string, status string, isDeleted bool, createdAt, updatedAt time.Time, version int) *Product {
	return &Product{
		id:            id,
		name:          name,
		desc:          desc,
		price:         price,
		originalPrice: originalPrice,
		quantity:      quantity,
		unit:          valueobject.ProductUnit(unit),
		tags:          tags,
		img:           img,
		status:        valueobject.ProductStatus(status),
		isDeleted:     isDeleted,
		createdAt:     createdAt,
		updatedAt:     updatedAt,
		version:       version,
	}
}
