package activationLink

import (
	"github/nnniyaz/ardo/domain/base"
)

type ActivationLink struct {
	link        base.UUID
	userId      base.UUID
	isActivated bool
}

func NewActivationLink(userId base.UUID) *ActivationLink {
	return &ActivationLink{
		link:        base.NewUUID(),
		userId:      userId,
		isActivated: false,
	}
}

func (a *ActivationLink) GetLink() base.UUID {
	return a.link
}

func (a *ActivationLink) GetUserId() base.UUID {
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
	a.link = base.NewUUID()
}
