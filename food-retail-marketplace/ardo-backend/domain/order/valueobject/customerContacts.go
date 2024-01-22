package valueobject

import (
	"github/nnniyaz/ardo/domain/base/email"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyCustomerName  = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_CUSTOMER_NAME)
	ErrEmptyCustomerPhone = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_CUSTOMER_PHONE)
)

type CustomerContacts struct {
	name  string
	phone string
	email email.Email
}

func NewCustomerContacts(name, phone string, mail string) CustomerContacts {
	return CustomerContacts{
		name:  name,
		phone: phone,
		email: email.Email(mail),
	}
}

func (c *CustomerContacts) GetName() string {
	return c.name
}

func (c *CustomerContacts) GetPhone() string {
	return c.phone
}

func (c *CustomerContacts) GetEmail() email.Email {
	return c.email
}

func (c *CustomerContacts) Validate() error {
	if c.name == "" {
		return ErrEmptyCustomerName
	}

	if c.phone == "" {
		return ErrEmptyCustomerPhone
	}

	if err := c.email.Validate(); err != nil {
		return err
	}
	return nil
}

func UnmarshalCustomerContactsFromDatabase(name, phone string, mail string) CustomerContacts {
	return CustomerContacts{
		name:  name,
		phone: phone,
		email: email.Email(mail),
	}
}
