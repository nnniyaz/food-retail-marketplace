package organization

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization/org_name"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"time"
)

type Organization struct {
	id         base.UUID
	logo       string
	name       org_name.OrgName
	currency   valueobject.Currency
	isDisabled bool
	isDeleted  bool
	createdAt  time.Time
	updatedAt  time.Time
}

func NewOrganization(logo string, currency string) (*Organization, error) {
	orgId := base.NewUUID()

	orgCurrency, err := valueobject.NewCurrency(currency)
	if err != nil {
		return nil, err
	}

	return &Organization{
		id:         orgId,
		logo:       logo,
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

func UnmarshalOrganizationFromDatabase(orgId base.UUID, logo, name string, currency string, isDisabled, isDeleted bool, createdAt, updatedAt time.Time) (*Organization, error) {
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
		currency:   orgCurrency,
		isDisabled: isDisabled,
		isDeleted:  isDeleted,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}, nil
}
