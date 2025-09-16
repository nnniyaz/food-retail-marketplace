package orderSettings

import (
	"github/nnniyaz/ardo/domain/orderSettings/valueobject"
	"time"
)

type OrderSettings struct {
	moq       valueobject.Moq
	createdAt time.Time
	updatedAt time.Time
	version   int
}

func NewOrderSettings() *OrderSettings {
	moq := valueobject.NewMoq(0, 0)
	return &OrderSettings{
		moq:       moq,
		createdAt: time.Now(),
		updatedAt: time.Now(),
		version:   1,
	}
}

func (os *OrderSettings) GetMoq() valueobject.Moq {
	return os.moq
}

func (os *OrderSettings) GetCreatedAt() time.Time {
	return os.createdAt
}

func (os *OrderSettings) GetUpdatedAt() time.Time {
	return os.updatedAt
}

func (os *OrderSettings) GetVersion() int {
	return os.version
}

func (os *OrderSettings) UpdateMoq(fee, freeFrom int64) {
	moq := valueobject.NewMoq(fee, freeFrom)
	os.moq = moq
	os.updatedAt = time.Now()
}

func UnmarshalOrderSettingsFromDatabase(moq valueobject.Moq, createdAt, updatedAt time.Time, version int) *OrderSettings {
	return &OrderSettings{
		moq:       moq,
		createdAt: createdAt,
		updatedAt: updatedAt,
		version:   version,
	}
}
