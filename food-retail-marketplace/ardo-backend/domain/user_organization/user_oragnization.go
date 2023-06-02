package user_organization

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	"time"
)

type UserOrganization struct {
	id        base.UUID
	userId    base.UUID
	role      valueobject.MerchantRole
	createdAt time.Time
	updatedAt time.Time
}

func NewUserOrganization(userId base.UUID, role string) (*UserOrganization, error) {
	merchantRole, err := valueobject.NewMerchantRole(role)
	if err != nil {
		return nil, err
	}

	userOrganization := &UserOrganization{
		id:        base.NewUUID(),
		userId:    userId,
		role:      merchantRole,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}
	return userOrganization, nil
}

func (o *UserOrganization) GetId() base.UUID {
	return o.id
}

func (o *UserOrganization) GetUserId() base.UUID {
	return o.userId
}

func (o *UserOrganization) GetRole() valueobject.MerchantRole {
	return o.role
}

func (o *UserOrganization) GetCreatedAt() time.Time {
	return o.createdAt
}

func (o *UserOrganization) GetUpdatedAt() time.Time {
	return o.updatedAt
}

func UnmarshalUserOrganizationFromDatabase(id base.UUID, userId base.UUID, role string, createdAt time.Time, updatedAt time.Time) *UserOrganization {
	return &UserOrganization{
		id:        id,
		userId:    userId,
		role:      valueobject.MerchantRole(role),
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
