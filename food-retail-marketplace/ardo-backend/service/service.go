package service

import (
	"github.com/aws/aws-sdk-go/service/s3"
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
	"github/nnniyaz/ardo/service/orderSettings"
	"github/nnniyaz/ardo/service/product"
	"github/nnniyaz/ardo/service/section"
	"github/nnniyaz/ardo/service/session"
	"github/nnniyaz/ardo/service/slide"
	"github/nnniyaz/ardo/service/upload"
	"github/nnniyaz/ardo/service/user"
)

type Services struct {
	Upload                  upload.UploadService
	Auth                    auth.AuthService
	CurrentUser             current_user.CurrentUserService
	Client                  client.ClientService
	ManagementUser          management.ManagementUserService
	ManagementProduct       management.ManagementProductService
	ManagementOrder         management.ManagementOrderService
	ManagementCatalog       management.ManagementCatalogService
	ManagementSection       management.ManagementSectionService
	ManagementCategory      management.ManagementCategoryService
	ManagementSlide         management.ManagementSlideService
	ManagementOrderSettings management.ManagementOrderSettingsService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email, s3 *s3.S3) *Services {
	sessionService := session.NewSessionService(l, repos.RepoSession)
	linkService := link.NewActivationLinkService(l, repos.RepoActivationLink)
	userService := user.NewUserService(l, repos.RepoUser)
	productService := product.NewProductService(l, repos.RepoProduct)
	orderService := order.NewOrderService(l, repos.RepoOrder)
	catalogService := catalog.NewCatalogService(l, repos.RepoCatalog, repos.RepoSection, repos.RepoCategory, repos.RepoProduct)
	sectionService := section.NewSectionService(l, repos.RepoSection)
	categoryService := category.NewCategoryService(l, repos.RepoCategory)
	slideService := slide.NewSlideService(l, repos.RepoSlide)
	orderSettingsService := orderSettings.NewOrderSettingsService(l, repos.RepoOrderSettings)

	return &Services{
		Upload:                  upload.NewUploadService(l, s3),
		Auth:                    auth.NewAuthService(l, config, emailService, userService, sessionService, linkService),
		CurrentUser:             current_user.NewCurrentUser(l, userService, sessionService),
		Client:                  client.NewClientService(l, orderService, emailService, userService),
		ManagementUser:          management.NewManagementUserService(l, userService),
		ManagementProduct:       management.NewManagementProductService(l, productService),
		ManagementOrder:         management.NewManagementOrderService(l, orderService),
		ManagementCatalog:       management.NewManagementCatalogService(l, catalogService, sectionService, categoryService, productService, slideService, orderSettingsService),
		ManagementSection:       management.NewManagementSectionService(l, sectionService),
		ManagementCategory:      management.NewManagementCategoryService(l, categoryService),
		ManagementSlide:         management.NewManagementSlideService(l, slideService),
		ManagementOrderSettings: management.NewManagementOrderSettingsService(l, orderSettingsService),
	}
}
