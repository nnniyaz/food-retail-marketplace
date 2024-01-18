package link

import (
	"context"
	"github/nnniyaz/ardo/domain/activationLink"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type ActivationLinkService interface {
	GetByUserId(ctx context.Context, userId string) (*activationLink.ActivationLink, error)
	Create(ctx context.Context, newActivationLink *activationLink.ActivationLink) error
	UpdateIsActivated(ctx context.Context, link string, isActivated bool) error
	UpdateLink(ctx context.Context, link *activationLink.ActivationLink) error
}

type activationLinkService struct {
	linkRepo repo.ActivationLink
	logger   logger.Logger
}

func NewActivationLinkService(repo repo.ActivationLink, l logger.Logger) ActivationLinkService {
	return &activationLinkService{linkRepo: repo, logger: l}
}

func (a *activationLinkService) GetByUserId(ctx context.Context, userId string) (*activationLink.ActivationLink, error) {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	foundActivationLink, err := a.linkRepo.FindOneByUserId(ctx, convertedUserId)
	if err != nil {
		return nil, err
	}
	return foundActivationLink, nil
}

func (a *activationLinkService) Create(ctx context.Context, newActivationLink *activationLink.ActivationLink) error {
	return a.linkRepo.Create(ctx, newActivationLink)
}

func (a *activationLinkService) UpdateIsActivated(ctx context.Context, link string, isActivated bool) error {
	convertedLink, err := uuid.UUIDFromString(link)
	if err != nil {
		return err
	}
	foundActivationLink, err := a.linkRepo.FindOneByLinkId(ctx, convertedLink)
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

func (a *activationLinkService) UpdateLink(ctx context.Context, updatedLink *activationLink.ActivationLink) error {
	return a.linkRepo.Update(ctx, updatedLink)
}
