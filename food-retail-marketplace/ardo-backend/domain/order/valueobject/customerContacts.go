package valueobject

import (
	"github/nnniyaz/ardo/domain/base/email"
	"github/nnniyaz/ardo/domain/base/phone"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyCustomerName = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_CUSTOMER_NAME)
)

type CustomerContacts struct {
	name  string
	phone phone.Phone
	email email.Email
}

func NewCustomerContacts(name, phoneNumber, countryCode, mail string) (CustomerContacts, error) {
	if name == "" {
		return CustomerContacts{}, ErrEmptyCustomerName
	}
	customerPhone, err := phone.NewPhone(phoneNumber, countryCode)
	if err != nil {
		return CustomerContacts{}, err
	}
	customerEmail, err := email.NewEmail(mail)
	if err != nil {
		return CustomerContacts{}, err
	}
	return CustomerContacts{
		name:  name,
		phone: customerPhone,
		email: customerEmail,
	}, nil
}

func (c *CustomerContacts) GetName() string {
	return c.name
}

func (c *CustomerContacts) GetPhone() phone.Phone {
	return c.phone
}

func (c *CustomerContacts) GetEmail() email.Email {
	return c.email
}

func UnmarshalCustomerContactsFromDatabase(name string, phone phone.Phone, mail string) CustomerContacts {
	return CustomerContacts{
		name:  name,
		phone: phone,
		email: email.Email(mail),
	}
}
