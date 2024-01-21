package valueobject

import "github/nnniyaz/ardo/pkg/core"

var ErrEmptyDeliveryAddress = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_DELIVERY_ADDRESS)

type DeliveryInfo struct {
	address         string
	floor           string
	apartment       string
	deliveryComment string
}

func (d *DeliveryInfo) GetAddress() string {
	return d.address
}

func (d *DeliveryInfo) GetFloor() string {
	return d.floor
}

func (d *DeliveryInfo) GetApartment() string {
	return d.apartment
}

func (d *DeliveryInfo) GetDeliveryComment() string {
	return d.deliveryComment
}

func (d *DeliveryInfo) Validate() error {
	if d.address == "" {
		return ErrEmptyDeliveryAddress
	}
	return nil
}

func UnmarshalDeliveryInfoFromDatabase(address, floor, apartment, deliveryComment string) DeliveryInfo {
	return DeliveryInfo{
		address:         address,
		floor:           floor,
		apartment:       apartment,
		deliveryComment: deliveryComment,
	}
}
