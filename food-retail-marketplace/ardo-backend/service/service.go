package service

import (
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

func NewService(repos *repo.Repository) *Services {
	userService := user.NewUserService(repos.RepoUser)
	sessionService := session.NewSessionService(repos.RepoSession)
	linkService := link.NewActivationLinkService(repos.RepoActivationLink)

	return &Services{
		Auth:       auth.NewAuthService(userService, sessionService, linkService),
		Management: management.NewManagementService(userService),
	}
}
