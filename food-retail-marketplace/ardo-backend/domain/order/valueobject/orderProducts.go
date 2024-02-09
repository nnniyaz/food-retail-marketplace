package valueobject

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	orderExceptions "github/nnniyaz/ardo/domain/order/exceptions"
	productExceptions "github/nnniyaz/ardo/domain/product/exceptions"
	"github/nnniyaz/ardo/pkg/core"
)

type OrderProduct struct {
	productId    uuid.UUID
	productName  core.MlString
	quantity     int64
	pricePerUnit float64
	totalPrice   float64
}

func NewOrderProduct(productId string, productName core.MlString, quantity int64, pricePerUnit, totalPrice float64) OrderProduct {
	convertedProductId, err := uuid.UUIDFromString(productId)
	if err != nil {
		panic(err)
	}
	return OrderProduct{
		productId:    convertedProductId,
		productName:  productName,
		quantity:     quantity,
		pricePerUnit: pricePerUnit,
		totalPrice:   totalPrice,
	}
}

func (o *OrderProduct) GetProductId() uuid.UUID {
	return o.productId
}

func (o *OrderProduct) GetProductName() core.MlString {
	return o.productName
}

func (o *OrderProduct) GetQuantity() int64 {
	return o.quantity
}

func (o *OrderProduct) GetPricePerUnit() float64 {
	return o.pricePerUnit
}

func (o *OrderProduct) GetTotalPrice() float64 {
	return o.totalPrice
}

func (o *OrderProduct) Validate() error {
	if _, err := uuid.UUIDFromString(o.GetProductId().String()); err != nil {
		return err
	}

	if o.GetProductName().IsEmpty() {
		return productExceptions.ErrEmptyProductName
	}

	if o.GetQuantity() < 0 {
		return productExceptions.ErrInvalidProductQuantity
	}

	if o.GetPricePerUnit() < 0 {
		return productExceptions.ErrInvalidProductPrice
	}

	if o.GetTotalPrice() < 0 {
		return orderExceptions.ErrWrongProductsTotalPrice
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

func UnmarshalOrderProductFromDatabase(productId uuid.UUID, productName core.MlString, quantity int64, totalPrice float64) OrderProduct {
	return OrderProduct{
		productId:   productId,
		productName: productName,
		quantity:    quantity,
		totalPrice:  totalPrice,
	}
}
