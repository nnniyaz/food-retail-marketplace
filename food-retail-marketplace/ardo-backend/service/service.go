package service

import (
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/auth"
	"github/nnniyaz/ardo/service/catalog"
	"github/nnniyaz/ardo/service/category"
	"github/nnniyaz/ardo/service/client"
	"github/nnniyaz/ardo/service/current_user"
	"github/nnniyaz/ardo/service/link"
	"github/nnniyaz/ardo/service/management"
	"github/nnniyaz/ardo/service/order"
	"github/nnniyaz/ardo/service/product"
	"github/nnniyaz/ardo/service/section"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Auth               auth.AuthService
	CurrentUser        current_user.CurrentUserService
	ManagementUser     management.ManagementUserService
	ManagementProduct  management.ManagementProductService
	ManagementOrder    management.ManagementOrderService
	ManagementCatalog  management.ManagementCatalogService
	ManagementSection  management.ManagementSectionService
	ManagementCategory management.ManagementCategoryService
	Client             client.ClientService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email) *Services {
	sessionService := session.NewSessionService(l, repos.RepoSession)
	linkService := link.NewActivationLinkService(l, repos.RepoActivationLink)
	userService := user.NewUserService(l, repos.RepoUser)
	productService := product.NewProductService(l, repos.RepoProduct)
	orderService := order.NewOrderService(l, repos.RepoOrder)
	catalogService := catalog.NewCatalogService(l, repos.RepoCatalog, repos.RepoSection, repos.RepoCategory, repos.RepoProduct)
	sectionService := section.NewSectionService(l, repos.RepoSection)
	categoryService := category.NewCategoryService(l, repos.RepoCategory)

	return &Services{
		Auth:               auth.NewAuthService(l, config, emailService, userService, sessionService, linkService),
		CurrentUser:        current_user.NewCurrentUser(l, userService, sessionService),
		ManagementUser:     management.NewManagementUserService(l, userService),
		ManagementProduct:  management.NewManagementProductService(l, productService),
		ManagementOrder:    management.NewManagementOrderService(l, orderService),
		ManagementCatalog:  management.NewManagementCatalogService(l, catalogService),
		ManagementSection:  management.NewManagementSectionService(l, sectionService),
		ManagementCategory: management.NewManagementCategoryService(l, categoryService),
		Client:             client.NewClientService(l, orderService, emailService),
	}
}
