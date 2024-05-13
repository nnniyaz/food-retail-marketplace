package valueobject

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrInvalidOrderStatus = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ORDER_STATUS)
)

type OrderStatus string

const (
	ORDER_HAS_BEEN_PLACED OrderStatus = "ORDER_HAS_BEEN_PLACED"
	ORDER_CONFIRMED       OrderStatus = "ORDER_CONFIRMED"
	FINAL_INVOICE_SENT    OrderStatus = "FINAL_INVOICE_SENT"
	GOODS_DELIVERED       OrderStatus = "GOODS_DELIVERED"
	PAID                  OrderStatus = "PAID"
)

func NewOrderStatus(status string) (OrderStatus, error) {
	convertedStatus := OrderStatus(status)
	switch convertedStatus {
	case ORDER_HAS_BEEN_PLACED, ORDER_CONFIRMED, FINAL_INVOICE_SENT, GOODS_DELIVERED, PAID:
		return convertedStatus, nil
	}
	return "", ErrInvalidOrderStatus
}

func (o OrderStatus) String() string {
	return string(o)
}
