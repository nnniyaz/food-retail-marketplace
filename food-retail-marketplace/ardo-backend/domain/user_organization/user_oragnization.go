package user_organization

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	"time"
)

type UserOrganization struct {
	id        uuid.UUID
	userId    uuid.UUID
	role      valueobject.MerchantRole
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
}

func NewUserOrganization(userId uuid.UUID, role string) (*UserOrganization, error) {
	merchantRole, err := valueobject.NewMerchantRole(role)
	if err != nil {
		return nil, err
	}

	userOrganization := &UserOrganization{
		id:        uuid.NewUUID(),
		userId:    userId,
		role:      merchantRole,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}
	return userOrganization, nil
}

func (o *UserOrganization) GetId() uuid.UUID {
	return o.id
}

func (o *UserOrganization) GetUserId() uuid.UUID {
	return o.userId
}

func (o *UserOrganization) GetRole() valueobject.MerchantRole {
	return o.role
}

func (o *UserOrganization) GetIsDeleted() bool {
	return o.isDeleted
}

func (o *UserOrganization) GetCreatedAt() time.Time {
	return o.createdAt
}

func (o *UserOrganization) GetUpdatedAt() time.Time {
	return o.updatedAt
}

func UnmarshalUserOrganizationFromDatabase(id uuid.UUID, userId uuid.UUID, role string, isDeleted bool, createdAt time.Time, updatedAt time.Time) *UserOrganization {
	return &UserOrganization{
		id:        id,
		userId:    userId,
		role:      valueobject.MerchantRole(role),
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
