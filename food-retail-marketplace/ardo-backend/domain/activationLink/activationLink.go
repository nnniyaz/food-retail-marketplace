package activationLink

import (
	"github/nnniyaz/ardo/domain/base/uuid"
)

type ActivationLink struct {
	link        uuid.UUID
	userId      uuid.UUID
	isActivated bool
}

func NewActivationLink(userId uuid.UUID) *ActivationLink {
	return &ActivationLink{
		link:        uuid.NewUUID(),
		userId:      userId,
		isActivated: false,
	}
}

func (a *ActivationLink) GetLink() uuid.UUID {
	return a.link
}

func (a *ActivationLink) GetUserId() uuid.UUID {
	return a.userId
}

func (a *ActivationLink) GetIsActivated() bool {
	return a.isActivated
}

func (a *ActivationLink) Activate() {
	a.isActivated = true
}

func (a *ActivationLink) Deactivate() {
	a.isActivated = false
}

func (a *ActivationLink) UpdateLink() {
	a.link = uuid.NewUUID()
}

func UnmarshalActivationLinkFromDatabase(link uuid.UUID, userId uuid.UUID, isActivated bool) *ActivationLink {
	return &ActivationLink{
		link:        link,
		userId:      userId,
		isActivated: isActivated,
	}
}
