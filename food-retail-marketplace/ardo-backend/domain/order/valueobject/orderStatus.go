package valueobject

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidOrderStatus = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ORDER_STATUS)
)

type OrderStatus string

const (
	NEW       OrderStatus = "NEW"
	PENDING   OrderStatus = "PENDING"
	ACCEPTED  OrderStatus = "ACCEPTED"
	CANCELED  OrderStatus = "CANCELED"
	DELIVERED OrderStatus = "DELIVERED"
)

func NewOrderStatus(status string) (OrderStatus, error) {
	convertedStatus := OrderStatus(status)
	switch convertedStatus {
	case NEW, ACCEPTED, CANCELED, PENDING, DELIVERED:
		return convertedStatus, nil
	}
	return "", ErrInvalidOrderStatus
}

func (o OrderStatus) String() string {
	return string(o)
}
