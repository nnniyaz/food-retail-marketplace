package organization

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

var (
	ErrOrgLogoIsEmpty = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_ORG_LOGO)
)

type Organization struct {
	id        uuid.UUID
	logo      string
	name      valueobject.OrgName
	desc      valueobject.OrgDesc
	contacts  valueobject.OrgContact
	currency  valueobject.Currency
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
}

func NewOrganization(logo, name, currency, phone, email, address string, desc *core.MlString) (*Organization, error) {
	orgId := uuid.NewUUID()

	orgName, err := valueobject.NewOrgName(name)
	if err != nil {
		return nil, err
	}

	orgCurrency, err := valueobject.NewCurrency(currency)
	if err != nil {
		return nil, err
	}

	contact, err := valueobject.NewOrgContact(phone, email, address)
	if err != nil {
		return nil, err
	}

	orgDesc, err := valueobject.NewOrgDesc(desc)
	if err != nil {
		return nil, err
	}

	return &Organization{
		id:        orgId,
		logo:      logo,
		name:      orgName,
		desc:      orgDesc,
		contacts:  contact,
		currency:  orgCurrency,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (o *Organization) GetId() uuid.UUID {
	return o.id
}

func (o *Organization) GetLogo() string {
	return o.logo
}

func (o *Organization) GetName() valueobject.OrgName {
	return o.name
}

func (o *Organization) GetDesc() valueobject.OrgDesc {
	return o.desc
}

func (o *Organization) GetContacts() valueobject.OrgContact {
	return o.contacts
}

func (o *Organization) GetCurrency() valueobject.Currency {
	return o.currency
}

func (o *Organization) GetIsDeleted() bool {
	return o.isDeleted
}

func (o *Organization) GetCreatedAt() time.Time {
	return o.createdAt
}

func (o *Organization) GetUpdatedAt() time.Time {
	return o.updatedAt
}

func (o *Organization) UpdateOrgInfo(name, currency, phone, email, address string, desc *core.MlString) error {
	orgName, err := valueobject.NewOrgName(name)
	if err != nil {
		return err
	}

	orgCurrency, err := valueobject.NewCurrency(currency)
	if err != nil {
		return err
	}

	contact, err := valueobject.NewOrgContact(phone, email, address)
	if err != nil {
		return err
	}

	orgDesc, err := valueobject.NewOrgDesc(desc)
	if err != nil {
		return err
	}

	o.name = orgName
	o.desc = orgDesc
	o.contacts = contact
	o.currency = orgCurrency
	return nil
}

func (o *Organization) UpdateOrgLogo(logo string) error {
	if logo == "" {
		return ErrOrgLogoIsEmpty
	}
	o.logo = logo
	return nil
}

func UnmarshalOrganizationFromDatabase(orgId uuid.UUID, logo, name, currency string, desc valueobject.OrgDesc, contacts valueobject.OrgContact, isDeleted bool, createdAt, updatedAt time.Time) (*Organization, error) {
	orgCurrency, err := valueobject.NewCurrency(currency)
	if err != nil {
		return nil, err
	}

	orgName, err := valueobject.NewOrgName(name)
	if err != nil {
		return nil, err
	}
	return &Organization{
		id:        orgId,
		logo:      logo,
		name:      orgName,
		desc:      desc,
		contacts:  contacts,
		currency:  orgCurrency,
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}, nil
}
