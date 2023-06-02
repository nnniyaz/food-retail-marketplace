package link

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/repo"
)

type ActivationLinkService interface {
	GetByUserId(ctx context.Context, userId string) (*activationLink.ActivationLink, error)
	Create(ctx context.Context, userId string) (*activationLink.ActivationLink, error)
	UpdateIsActivated(ctx context.Context, link string, isActivated bool) error
	UpdateLink(ctx context.Context, userId string) error
}

type activationLinkService struct {
	linkRepo repo.ActivationLink
}

func NewActivationLinkService(repo repo.ActivationLink) ActivationLinkService {
	return &activationLinkService{linkRepo: repo}
}

func (a *activationLinkService) GetByUserId(ctx context.Context, userId string) (*activationLink.ActivationLink, error) {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	foundActivationLink, err := a.linkRepo.FindOneByUserId(ctx, convertedUserId)
	if err != nil {
		return nil, err
	}
	return foundActivationLink, nil
}

func (a *activationLinkService) Create(ctx context.Context, userId string) (*activationLink.ActivationLink, error) {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	newActivationLink := activationLink.NewActivationLink(convertedUserId)
	err = a.linkRepo.Create(ctx, newActivationLink)
	if err != nil {
		return nil, err
	}
	return newActivationLink, nil
}

func (a *activationLinkService) UpdateIsActivated(ctx context.Context, link string, isActivated bool) error {
	convertedLink, err := base.UUIDFromString(link)
	if err != nil {
		return err
	}
	foundActivationLink, err := a.linkRepo.FindOneByLink(ctx, convertedLink)
	if err != nil {
		return err
	}
	if isActivated {
		foundActivationLink.Activate()
	} else {
		foundActivationLink.Deactivate()
	}
	return a.linkRepo.Update(ctx, foundActivationLink)
}

func (a *activationLinkService) UpdateLink(ctx context.Context, userId string) error {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return err
	}
	foundActivationLink, err := a.linkRepo.FindOneByUserId(ctx, convertedUserId)
	if err != nil {
		return err
	}
	foundActivationLink.UpdateLink()
	return a.linkRepo.Update(ctx, foundActivationLink)
}
