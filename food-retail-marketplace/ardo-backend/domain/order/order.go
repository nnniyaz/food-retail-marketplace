package order

import (
	"github/nnniyaz/ardo/domain/base/currency"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order/exceptions"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"time"
)

type Order struct {
	id               uuid.UUID
	userId           uuid.UUID
	number           valueobject.OrderNumber
	products         []valueobject.OrderProduct
	quantity         int64
	totalPrice       float64
	currency         currency.Currency
	customerContacts valueobject.CustomerContacts
	deliveryInfo     valueobject.DeliveryInfo
	orderComment     string
	status           valueobject.OrderStatus
	isDeleted        bool
	createdAt        time.Time
	updatedAt        time.Time
	version          int
}

func NewOrder(userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, orderCurrency string, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment string) (*Order, error) {
	ts := time.Now()

	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}

	if err = valueobject.OrderProductsValidate(products); err != nil {
		return nil, err
	}

	if quantity < 0 {
		return nil, exceptions.ErrInvalidOrderQuantity
	}

	if totalPrice < 0 {
		return nil, exceptions.ErrInvalidOrderPrice
	}

	convertedCurrency, err := currency.NewCurrency(orderCurrency)
	if err != nil {
		return nil, err
	}

	if err = customerContacts.Validate(); err != nil {
		return nil, err
	}

	if err = deliveryInfo.Validate(); err != nil {
		return nil, err
	}

	return &Order{
		id:               uuid.NewUUID(),
		userId:           convertedUserId,
		number:           valueobject.GenerateOrderNumber(ts),
		products:         products,
		quantity:         quantity,
		totalPrice:       totalPrice,
		currency:         convertedCurrency,
		customerContacts: customerContacts,
		deliveryInfo:     deliveryInfo,
		orderComment:     orderComment,
		status:           valueobject.NEW,
		isDeleted:        false,
		createdAt:        time.Now(),
		updatedAt:        time.Now(),
		version:          1,
	}, nil
}

func (o *Order) GetId() uuid.UUID {
	return o.id
}

func (o *Order) GetUserId() uuid.UUID {
	return o.userId
}

func (o *Order) GetNumber() valueobject.OrderNumber {
	return o.number
}

func (o *Order) GetProducts() []valueobject.OrderProduct {
	return o.products
}

func (o *Order) GetQuantity() int64 {
	return o.quantity
}

func (o *Order) GetTotalPrice() float64 {
	return o.totalPrice
}

func (o *Order) GetCurrency() currency.Currency {
	return o.currency
}

func (o *Order) GetCustomerContacts() valueobject.CustomerContacts {
	return o.customerContacts
}

func (o *Order) GetDeliveryInfo() valueobject.DeliveryInfo {
	return o.deliveryInfo
}

func (o *Order) GetOrderComment() string {
	return o.orderComment
}

func (o *Order) GetStatus() valueobject.OrderStatus {
	return o.status
}

func (o *Order) GetIsDeleted() bool {
	return o.isDeleted
}

func (o *Order) GetCreatedAt() time.Time {
	return o.createdAt
}

func (o *Order) GetUpdatedAt() time.Time {
	return o.updatedAt
}

func (o *Order) GetVersion() int {
	return o.version
}

func (o *Order) UpdateStatus(status string) error {
	orderStatus, err := valueobject.NewOrderStatus(status)
	if err != nil {
		return err
	}
	o.status = orderStatus
	o.updatedAt = time.Now()
	o.version++
	return nil
}

func UnmarshalOrderFromDatabase(id uuid.UUID, userId uuid.UUID, number string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, orderCurrency string, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment, status string, isDeleted bool, createdAt, updatedAt time.Time, version int) *Order {
	return &Order{
		id:               id,
		userId:           userId,
		number:           valueobject.OrderNumber(number),
		products:         products,
		quantity:         quantity,
		totalPrice:       totalPrice,
		currency:         currency.Currency(orderCurrency),
		customerContacts: customerContacts,
		deliveryInfo:     deliveryInfo,
		orderComment:     orderComment,
		status:           valueobject.OrderStatus(status),
		isDeleted:        isDeleted,
		createdAt:        createdAt,
		updatedAt:        updatedAt,
		version:          version,
	}
}
