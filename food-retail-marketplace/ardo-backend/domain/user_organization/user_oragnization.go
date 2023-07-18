package user_organization

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user_organization/valueobject"
	"time"
)

type UserOrganization struct {
	id        uuid.UUID
	orgId     uuid.UUID
	userId    uuid.UUID
	role      valueobject.MerchantRole
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
}

func NewUserOrganization(orgId uuid.UUID, userId uuid.UUID, role string) (*UserOrganization, error) {
	merchantRole, err := valueobject.NewMerchantRole(role)
	if err != nil {
		return nil, err
	}
	return &UserOrganization{
		id:        uuid.NewUUID(),
		orgId:     orgId,
		userId:    userId,
		role:      merchantRole,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (o *UserOrganization) GetId() uuid.UUID {
	return o.id
}

func (o *UserOrganization) GetOrgId() uuid.UUID {
	return o.orgId
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

func UnmarshalUserOrganizationFromDatabase(id uuid.UUID, orgId uuid.UUID, userId uuid.UUID, role string, isDeleted bool, createdAt time.Time, updatedAt time.Time) *UserOrganization {
	return &UserOrganization{
		id:        id,
		orgId:     orgId,
		userId:    userId,
		role:      valueobject.MerchantRole(role),
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
