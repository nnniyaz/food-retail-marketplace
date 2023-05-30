package service

import (
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/auth"
	"github/nnniyaz/ardo/service/link"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth auth.AuthService
}

func NewService(repos *repo.Repository) *Services {
	user := user.NewUserService(repos.RepoUser)
	session := session.NewSessionService(repos.RepoSession)
	link := link.NewActivationLinkService(repos.RepoActivationLink)

	return &Services{
		Auth: auth.NewAuthService(user, session, link),
	}
}
