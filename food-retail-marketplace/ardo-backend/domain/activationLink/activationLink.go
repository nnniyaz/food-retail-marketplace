package activationLink

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"time"
)

type ActivationLink struct {
	linkId      uuid.UUID
	userId      uuid.UUID
	isActivated bool
	createdAt   time.Time
	updatedAt   time.Time
	version     int64
}

func NewActivationLink(userId uuid.UUID) *ActivationLink {
	return &ActivationLink{
		linkId:      uuid.NewUUID(),
		userId:      userId,
		isActivated: false,
		createdAt:   time.Now(),
		updatedAt:   time.Now(),
	}
}

func (a *ActivationLink) GetLinkId() uuid.UUID {
	return a.linkId
}

func (a *ActivationLink) GetUserId() uuid.UUID {
	return a.userId
}

func (a *ActivationLink) GetIsActivated() bool {
	return a.isActivated
}

func (a *ActivationLink) GetCreatedAt() time.Time {
	return a.createdAt
}

func (a *ActivationLink) GetUpdatedAt() time.Time {
	return a.updatedAt
}

func (a *ActivationLink) Activate() {
	a.isActivated = true
	a.updatedAt = time.Now()
}

func (a *ActivationLink) Deactivate() {
	a.isActivated = false
	a.updatedAt = time.Now()
}

func (a *ActivationLink) UpdateLinkId() {
	a.linkId = uuid.NewUUID()
	a.updatedAt = time.Now()
}

func UnmarshalActivationLinkFromDatabase(linkId, userId uuid.UUID, isActivated bool, createdAt, updatedAt time.Time) *ActivationLink {
	return &ActivationLink{
		linkId:      linkId,
		userId:      userId,
		isActivated: isActivated,
		createdAt:   createdAt,
		updatedAt:   updatedAt,
	}
}
