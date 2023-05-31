package organization

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"time"
)

type Organization struct {
	id        uuid.UUID
	userId    uuid.UUID
	role      valueobject.MerchantRole
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
}

func NewOrganization(userId uuid.UUID, role string) (*Organization, error) {
	merchantRole, err := valueobject.NewMerchantRole(role)
	if err != nil {
		return nil, err
	}

	organization := &Organization{
		id:        uuid.NewUUID(),
		userId:    userId,
		role:      merchantRole,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}
	return organization, nil
}

func (o *Organization) GetId() uuid.UUID {
	return o.id
}

func (o *Organization) GetUserId() uuid.UUID {
	return o.userId
}

func (o *Organization) GetRole() valueobject.MerchantRole {
	return o.role
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

func UnmarshalOrganizationFromDatabase(id uuid.UUID, userId uuid.UUID, role string, isDeleted bool, createdAt time.Time, updatedAt time.Time) *Organization {
	return &Organization{
		id:        id,
		userId:    userId,
		role:      valueobject.MerchantRole(role),
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
