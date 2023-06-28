package service

import (
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/auth"
	"github/nnniyaz/ardo/service/currentUser"
	"github/nnniyaz/ardo/service/link"
	"github/nnniyaz/ardo/service/management"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth        auth.AuthService
	Management  management.ManagementService
	CurrentUser currentUser.CurrentUserService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email) *Services {
	userService := user.NewUserService(repos.RepoUser, l)
	sessionService := session.NewSessionService(repos.RepoSession, l)
	linkService := link.NewActivationLinkService(repos.RepoActivationLink, l)

	return &Services{
		Auth:        auth.NewAuthService(userService, sessionService, linkService, l, config, emailService),
		Management:  management.NewManagementService(userService, l),
		CurrentUser: currentUser.NewCurrentUser(userService, sessionService, l),
	}
}
