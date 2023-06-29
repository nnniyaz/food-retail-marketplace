package valueobject

import (
	"github/nnniyaz/ardo/domain/base/email"
	"github/nnniyaz/ardo/domain/base/phone"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyAddress = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_ADDRESS)
)

type OrgContact struct {
	phone   phone.Phone
	email   email.Email
	address string
}

func NewOrgContact(phoneNumber, mail, address string) (OrgContact, error) {
	orgEmail, err := email.NewEmail(mail)
	if err != nil {
		return OrgContact{}, err
	}

	orgPhone, err := phone.NewPhone(phoneNumber)
	if err != nil {
		return OrgContact{}, err
	}

	if address == "" {
		return OrgContact{}, ErrEmptyAddress
	}
	return OrgContact{
		phone:   orgPhone,
		email:   orgEmail,
		address: address,
	}, nil
}

func (o OrgContact) GetPhone() phone.Phone {
	return o.phone
}

func (o OrgContact) GetEmail() email.Email {
	return o.email
}

func (o OrgContact) GetAddress() string {
	return o.address
}

func UnmarshalOrgContactFromDatabase(phoneNumber, mail, address string) (OrgContact, error) {
	orgEmail, err := email.NewEmail(mail)
	if err != nil {
		return OrgContact{}, err
	}
	orgPhone, err := phone.NewPhone(phoneNumber)
	if err != nil {
		return OrgContact{}, err
	}
	return OrgContact{
		phone:   orgPhone,
		email:   orgEmail,
		address: address,
	}, nil
}
