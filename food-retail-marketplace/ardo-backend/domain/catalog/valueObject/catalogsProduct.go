package valueObject

import "github/nnniyaz/ardo/domain/base/uuid"

type CatalogsProduct struct {
	productId uuid.UUID
}

func NewCatalogsProduct() *CatalogsProduct {
	return &CatalogsProduct{
		productId: uuid.NewUUID(),
	}
}

func (p *CatalogsProduct) GetId() uuid.UUID {
	return p.productId
}

func UnmarshalCatalogsProductFromDatabase(productId uuid.UUID) CatalogsProduct {
	return CatalogsProduct{
		productId: productId,
	}
}
