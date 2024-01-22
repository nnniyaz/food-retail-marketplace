package order

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

var (
	ErrInvalidOrderQuantity = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ORDER_QUANTITY)
	ErrInvalidOrderPrice    = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ORDER_PRICE)
)

type Order struct {
	id               uuid.UUID
	userId           uuid.UUID
	products         []valueobject.OrderProduct
	quantity         int
	totalPrice       float64
	customerContacts valueobject.CustomerContacts
	deliveryInfo     valueobject.DeliveryInfo
	orderComment     string
	status           valueobject.OrderStatus
	isDeleted        bool
	createdAt        time.Time
	updatedAt        time.Time
}

func NewOrder(userId string, products []valueobject.OrderProduct, quantity int, totalPrice float64, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment string) (*Order, error) {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}

	if err = valueobject.OrderProductsValidate(products); err != nil {
		return nil, err
	}

	if quantity < 0 {
		return nil, ErrInvalidOrderQuantity
	}

	if totalPrice < 0 {
		return nil, ErrInvalidOrderPrice
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
		products:         products,
		quantity:         quantity,
		totalPrice:       totalPrice,
		customerContacts: customerContacts,
		deliveryInfo:     deliveryInfo,
		orderComment:     orderComment,
		status:           valueobject.NEW,
		isDeleted:        false,
		createdAt:        time.Now(),
		updatedAt:        time.Now(),
	}, nil
}

func (o *Order) GetId() uuid.UUID {
	return o.id
}

func (o *Order) GetUserId() uuid.UUID {
	return o.userId
}

func (o *Order) GetProducts() []valueobject.OrderProduct {
	return o.products
}

func (o *Order) GetQuantity() int {
	return o.quantity
}

func (o *Order) GetTotalPrice() float64 {
	return o.totalPrice
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

func (o *Order) UpdateStatus(status string) error {
	orderStatus, err := valueobject.NewOrderStatus(status)
	if err != nil {
		return err
	}
	o.status = orderStatus
	o.updatedAt = time.Now()
	return nil
}

func UnmarshalOrderFromDatabase(id uuid.UUID, userId uuid.UUID, products []valueobject.OrderProduct, quantity int, totalPrice float64, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment, status string, isDeleted bool, createdAt, updatedAt time.Time) *Order {
	return &Order{
		id:               id,
		userId:           userId,
		products:         products,
		quantity:         quantity,
		totalPrice:       totalPrice,
		customerContacts: customerContacts,
		deliveryInfo:     deliveryInfo,
		orderComment:     orderComment,
		status:           valueobject.OrderStatus(status),
		isDeleted:        isDeleted,
		createdAt:        createdAt,
		updatedAt:        updatedAt,
	}
}
