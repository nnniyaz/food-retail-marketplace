package valueobject

import (
	"math/rand"
	"time"
)

type OrderNumber string

const (
	ORDER_NUMBER_LENGTH = 12
	ORDER_NUMBER_DIGITS = "0123456789"
)

func GenerateOrderNumber(t time.Time) OrderNumber {
	src := rand.NewSource(t.UnixNano())
	r := rand.New(src)
	b := make([]byte, ORDER_NUMBER_LENGTH)
	for i := range b {
		b[i] = ORDER_NUMBER_DIGITS[r.Intn(len(ORDER_NUMBER_DIGITS))]
	}
	return OrderNumber(b)
}

func (o OrderNumber) String() string {
	return string(o)
}
