package valueobject

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/core"
)

var ErrEmptyDeliveryAddress = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_DELIVERY_ADDRESS)

type DeliveryPoint struct {
	id              uuid.UUID
	address         string
	floor           string
	apartment       string
	deliveryComment string
}

func NewDeliveryPoint(address, floor, apartment, deliveryComment string) (DeliveryPoint, error) {
	return DeliveryPoint{
		id:              uuid.NewUUID(),
		address:         address,
		floor:           floor,
		apartment:       apartment,
		deliveryComment: deliveryComment,
	}, nil
}

func (d *DeliveryPoint) GetId() uuid.UUID {
	return d.id
}

func (d *DeliveryPoint) GetAddress() string {
	return d.address
}

func (d *DeliveryPoint) GetFloor() string {
	return d.floor
}

func (d *DeliveryPoint) GetApartment() string {
	return d.apartment
}

func (d *DeliveryPoint) GetDeliveryComment() string {
	return d.deliveryComment
}

func (d *DeliveryPoint) Update(address, floor, apartment, deliveryComment string) error {
	if address == "" {
		return ErrEmptyDeliveryAddress
	}
	d.address = address
	d.floor = floor
	d.apartment = apartment
	d.deliveryComment = deliveryComment
	return nil
}

func UnmarshalDeliveryPointFromDatabase(id uuid.UUID, address, floor, apartment, deliveryComment string) DeliveryPoint {
	return DeliveryPoint{
		id:              id,
		address:         address,
		floor:           floor,
		apartment:       apartment,
		deliveryComment: deliveryComment,
	}
}

func UnmarshalDeliveryPointFromRequest(id uuid.UUID, address, floor, apartment, deliveryComment string) DeliveryPoint {
	return DeliveryPoint{
		id:              id,
		address:         address,
		floor:           floor,
		apartment:       apartment,
		deliveryComment: deliveryComment,
	}
}
