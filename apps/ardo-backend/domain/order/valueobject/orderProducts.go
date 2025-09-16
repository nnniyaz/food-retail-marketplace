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

func NewOrderProduct(productId string, productName core.MlString, quantity int64, pricePerUnit, totalPrice float64) (OrderProduct, error) {
	convertedProductId, err := uuid.UUIDFromString(productId)
	if err != nil {
		return OrderProduct{}, err
	}
	if productName.IsEmpty() {
		return OrderProduct{}, productExceptions.ErrEmptyProductName
	}
	if quantity < 0 {
		return OrderProduct{}, productExceptions.ErrInvalidProductQuantity
	}
	if pricePerUnit < 0 {
		return OrderProduct{}, productExceptions.ErrInvalidProductPrice
	}
	if totalPrice < 0 {
		return OrderProduct{}, orderExceptions.ErrWrongProductsTotalPrice
	}
	return OrderProduct{
		productId:    convertedProductId,
		productName:  productName,
		quantity:     quantity,
		pricePerUnit: pricePerUnit,
		totalPrice:   totalPrice,
	}, nil
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

func UnmarshalOrderProductFromDatabase(productId uuid.UUID, productName core.MlString, quantity int64, pricePerUnit, totalPrice float64) OrderProduct {
	return OrderProduct{
		productId:    productId,
		productName:  productName,
		quantity:     quantity,
		pricePerUnit: pricePerUnit,
		totalPrice:   totalPrice,
	}
}
