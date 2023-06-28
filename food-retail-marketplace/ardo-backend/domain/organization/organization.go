package organization

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization/org_contact"
	"github/nnniyaz/ardo/domain/organization/org_desc"
	"github/nnniyaz/ardo/domain/organization/org_name"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"time"
)

type Organization struct {
	id         base.UUID
	logo       string
	name       org_name.OrgName
	desc       org_desc.OrgDesc
	contacts   org_contact.OrgContact
	currency   valueobject.Currency
	isDisabled bool
	isDeleted  bool
	createdAt  time.Time
	updatedAt  time.Time
}

func NewOrganization(logo, name, currency string, orgDesc org_desc.OrgDesc, contact org_contact.OrgContact) (*Organization, error) {
	orgId := base.NewUUID()

	orgName, err := org_name.New(name)
	if err != nil {
		return nil, err
	}

	orgCurrency, err := valueobject.NewCurrency(currency)
	if err != nil {
		return nil, err
	}

	return &Organization{
		id:         orgId,
		logo:       logo,
		name:       orgName,
		desc:       orgDesc,
		contacts:   contact,
		currency:   orgCurrency,
		isDisabled: false,
		isDeleted:  false,
		createdAt:  time.Now(),
		updatedAt:  time.Now(),
	}, nil
}

func (o *Organization) GetId() base.UUID {
	return o.id
}

func (o *Organization) GetLogo() string {
	return o.logo
}

func (o *Organization) GetName() org_name.OrgName {
	return o.name
}

func (o *Organization) GetDesc() org_desc.OrgDesc {
	return o.desc
}

func (o *Organization) GetContacts() org_contact.OrgContact {
	return o.contacts
}

func (o *Organization) GetCurrency() valueobject.Currency {
	return o.currency
}

func (o *Organization) IsDisabled() bool {
	return o.isDisabled
}

func (o *Organization) IsDeleted() bool {
	return o.isDeleted
}

func (o *Organization) GetCreatedAt() time.Time {
	return o.createdAt
}

func (o *Organization) GetUpdatedAt() time.Time {
	return o.updatedAt
}

func UnmarshalOrganizationFromDatabase(orgId base.UUID, logo, name, currency string, desc org_desc.OrgDesc, contacts org_contact.OrgContact, isDisabled, isDeleted bool, createdAt, updatedAt time.Time) (*Organization, error) {
	orgCurrency, err := valueobject.NewCurrency(currency)
	if err != nil {
		return nil, err
	}

	orgName, err := org_name.New(name)
	if err != nil {
		return nil, err
	}
	return &Organization{
		id:         orgId,
		logo:       logo,
		name:       orgName,
		desc:       desc,
		contacts:   contacts,
		currency:   orgCurrency,
		isDisabled: isDisabled,
		isDeleted:  isDeleted,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}, nil
}
