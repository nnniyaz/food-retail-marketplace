package valueobject

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/product/exceptions"
	"github/nnniyaz/ardo/pkg/core"
)

type OrderProduct struct {
	productId   uuid.UUID
	productName core.MlString
	quantity    int
	totalPrice  float64
}

func (o *OrderProduct) GetProductId() uuid.UUID {
	return o.productId
}

func (o *OrderProduct) GetProductName() core.MlString {
	return o.productName
}

func (o *OrderProduct) GetQuantity() int {
	return o.quantity
}

func (o *OrderProduct) GetTotalPrice() float64 {
	return o.totalPrice
}

func (o *OrderProduct) Validate() error {
	if _, err := uuid.UUIDFromString(o.GetProductId().String()); err != nil {
		return err
	}

	if o.GetProductName().IsEmpty() {
		return exceptions.ErrEmptyProductName
	}

	if o.GetQuantity() < 0 {
		return exceptions.ErrInvalidProductQuantity
	}

	if o.GetTotalPrice() < 0 {
		return exceptions.ErrInvalidProductPrice
	}
	return nil
}

func OrderProductsValidate(orderProducts []OrderProduct) error {
	for _, orderProduct := range orderProducts {
		if err := orderProduct.Validate(); err != nil {
			return err
		}
	}
	return nil
}

func UnmarshalOrderProductFromDatabase(productId uuid.UUID, productName core.MlString, quantity int, totalPrice float64) OrderProduct {
	return OrderProduct{
		productId:   productId,
		productName: productName,
		quantity:    quantity,
		totalPrice:  totalPrice,
	}
}
