package product

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

var (
	ErrInvalidPrice    = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_PRICE)
	ErrInvalidQuantity = core.NewI18NError(core.EINVALID, core.TXT_INVALID_PRODUCT_QUANTITY)
)

type Product struct {
	id         uuid.UUID
	orgId      uuid.UUID
	sectionId  uuid.UUID
	categoryId uuid.UUID
	price      float64
	quantity   int
	status     valueobject.ProductStatus
	isDeleted  bool
	createdAt  time.Time
	updatedAt  time.Time
}

func NewProduct(orgId uuid.UUID, sectionId uuid.UUID, categoryId uuid.UUID, price float64, quantity int, status string) (*Product, error) {
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
		id:         uuid.NewUUID(),
		orgId:      orgId,
		sectionId:  sectionId,
		categoryId: categoryId,
		price:      price,
		quantity:   quantity,
		status:     productStatus,
		isDeleted:  false,
		createdAt:  time.Now(),
		updatedAt:  time.Now(),
	}, nil
}

func (p *Product) GetId() uuid.UUID {
	return p.id
}

func (p *Product) GetOrgId() uuid.UUID {
	return p.orgId
}

func (p *Product) GetSectionId() uuid.UUID {
	return p.sectionId
}

func (p *Product) GetCategoryId() uuid.UUID {
	return p.categoryId
}

func (p *Product) GetPrice() float64 {
	return p.price
}

func (p *Product) GetQuantity() int {
	return p.quantity
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

func UnmarshalProductFromDatabase(id, orgId, sectionId, categoryId uuid.UUID, price float64, quantity int, status string, isDeleted bool, createdAt, updatedAt time.Time) (*Product, error) {
	productStatus, err := valueobject.NewProductStatus(status)
	if err != nil {
		return nil, err
	}

	if price < 0 {
		return nil, ErrInvalidPrice
	}

	if quantity < 0 {
		return nil, ErrInvalidQuantity
	}

	return &Product{
		id:         id,
		orgId:      orgId,
		sectionId:  sectionId,
		categoryId: categoryId,
		price:      price,
		quantity:   quantity,
		status:     productStatus,
		isDeleted:  isDeleted,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}, nil
}
