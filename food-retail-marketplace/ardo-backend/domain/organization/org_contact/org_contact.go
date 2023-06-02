package org_contact

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyAddress = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_ADDRESS)
)

type OrgContact struct {
	orgId   base.UUID
	phone   base.Phone
	email   base.Email
	address string
}

func New(orgId base.UUID, phone, email, address string) (*OrgContact, error) {
	orgEmail, err := base.NewEmail(email)
	if err != nil {
		return nil, err
	}

	orgPhone, err := base.NewPhone(phone)
	if err != nil {
		return nil, err
	}

	if address == "" {
		return nil, ErrEmptyAddress
	}
	return &OrgContact{
		orgId:   orgId,
		phone:   orgPhone,
		email:   orgEmail,
		address: address,
	}, nil
}

func (o *OrgContact) GetOrgId() base.UUID {
	return o.orgId
}

func (o *OrgContact) GetPhone() base.Phone {
	return o.phone
}

func (o *OrgContact) GetEmail() base.Email {
	return o.email
}

func (o *OrgContact) GetAddress() string {
	return o.address
}

func UnmarshalOrgContactFromDatabase(orgId base.UUID, phone, email, address string) (*OrgContact, error) {
	orgEmail, err := base.NewEmail(email)
	if err != nil {
		return nil, err
	}

	orgPhone, err := base.NewPhone(phone)
	if err != nil {
		return nil, err
	}

	if address == "" {
		return nil, ErrEmptyAddress
	}
	return &OrgContact{
		orgId:   orgId,
		phone:   orgPhone,
		email:   orgEmail,
		address: address,
	}, nil
}
