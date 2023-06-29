package service

import (
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/auth"
	"github/nnniyaz/ardo/service/current_user"
	"github/nnniyaz/ardo/service/link"
	"github/nnniyaz/ardo/service/management"
	"github/nnniyaz/ardo/service/organization"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth                   auth.AuthService
	ManagementUser         management.ManagementUserService
	ManagementOrganization management.ManagementOrgService
	CurrentUser            current_user.CurrentUserService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email) *Services {
	userService := user.NewUserService(repos.RepoUser, l)
	sessionService := session.NewSessionService(repos.RepoSession, l)
	linkService := link.NewActivationLinkService(repos.RepoActivationLink, l)
	organizationService := organization.NewOrganizationService(repos.RepoOrganization, l)

	return &Services{
		Auth:                   auth.NewAuthService(userService, sessionService, linkService, l, config, emailService),
		ManagementUser:         management.NewManagementUserService(userService, l),
		ManagementOrganization: management.NewManagementOrgService(organizationService, l),
		CurrentUser:            current_user.NewCurrentUser(userService, sessionService, l),
	}
}
