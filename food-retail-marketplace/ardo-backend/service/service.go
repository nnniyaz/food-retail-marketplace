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
	"github/nnniyaz/ardo/service/order"
	"github/nnniyaz/ardo/service/product"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth              auth.AuthService
	CurrentUser       current_user.CurrentUserService
	ManagementUser    management.ManagementUserService
	ManagementProduct management.ManagementProductService
	ManagementOrder   management.ManagementOrderService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email) *Services {
	sessionService := session.NewSessionService(repos.RepoSession, l)
	linkService := link.NewActivationLinkService(repos.RepoActivationLink, l)
	userService := user.NewUserService(repos.RepoUser, l)
	productService := product.NewProductService(repos.RepoProduct, l)
	orderService := order.NewOrderService(repos.RepoOrder, l)

	return &Services{
		Auth:              auth.NewAuthService(userService, sessionService, linkService, l, config, emailService),
		CurrentUser:       current_user.NewCurrentUser(userService, sessionService, l),
		ManagementUser:    management.NewManagementUserService(userService, l),
		ManagementProduct: management.NewManagementProductService(productService, l),
		ManagementOrder:   management.NewManagementOrderService(orderService, l),
	}
}
