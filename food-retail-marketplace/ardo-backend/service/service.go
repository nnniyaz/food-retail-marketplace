package service

import (
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/pkg/email"
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
	User       user.UserService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email) *Services {
	userService := user.NewUserService(repos.RepoUser)
	sessionService := session.NewSessionService(repos.RepoSession)
	linkService := link.NewActivationLinkService(repos.RepoActivationLink)

	return &Services{
		Auth:       auth.NewAuthService(userService, sessionService, linkService, l, config, emailService),
		Management: management.NewManagementService(userService),
		User:       user.NewUserService(repos.RepoUser),
	}
}
