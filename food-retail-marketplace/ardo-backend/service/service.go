package service

import (
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/auth"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth auth.AuthService
	User user.UserService
}

func NewService(repos *repo.Repository) *Services {
	return &Services{
		Auth: auth.NewAuthService(repos),
		User: user.NewUserService(repos),
	}
}
