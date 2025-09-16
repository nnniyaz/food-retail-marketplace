package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

var (
	ErrInvalidOrderStatus = core.NewI18NError(core.EINVALID, core.TXT_INVALID_ORDER_STATUS)
)

type OrderStatusHistory struct {
	status    OrderStatus
	updatedAt time.Time
}

func NewOrderStatusHistory(status OrderStatus) OrderStatusHistory {
	return OrderStatusHistory{
		status:    status,
		updatedAt: time.Now(),
	}
}

func (o OrderStatusHistory) GetStatus() OrderStatus {
	return o.status
}

func (o OrderStatusHistory) GetUpdatedAt() time.Time {
	return o.updatedAt
}

func UnmarshalOrderStatusHistoryFromDatabase(status string, updatedAt time.Time) OrderStatusHistory {
	return OrderStatusHistory{
		status:    OrderStatus(status),
		updatedAt: updatedAt,
	}
}

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
