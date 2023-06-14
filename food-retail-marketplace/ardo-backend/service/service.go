package service

import (
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/auth"
	"github/nnniyaz/ardo/service/link"
	"github/nnniyaz/ardo/service/management"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth       auth.AuthService
	Management management.ManagementService
}

func NewService(repos *repo.Repository, config *config.ServiceConfig, l logger.Logger) *Services {
	userService := user.NewUserService(repos.RepoUser)
	sessionService := session.NewSessionService(repos.RepoSession)
	linkService := link.NewActivationLinkService(repos.RepoActivationLink)

	return &Services{
		Auth:       auth.NewAuthService(userService, sessionService, linkService, l, config),
		Management: management.NewManagementService(userService),
	}
}
