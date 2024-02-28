package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github/nnniyaz/ardo/handler/http/auth"
	"github/nnniyaz/ardo/handler/http/client"
	"github/nnniyaz/ardo/handler/http/current_user"
	"github/nnniyaz/ardo/handler/http/management_catalog"
	"github/nnniyaz/ardo/handler/http/management_category"
	"github/nnniyaz/ardo/handler/http/management_order"
	"github/nnniyaz/ardo/handler/http/management_product"
	"github/nnniyaz/ardo/handler/http/management_section"
	"github/nnniyaz/ardo/handler/http/management_user"
	middleware2 "github/nnniyaz/ardo/handler/http/middleware"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type Handler struct {
	Middleware         *middleware2.Middleware
	Auth               *auth.HttpDelivery
	User               *current_user.HttpDelivery
	ManagementUser     *management_user.HttpDelivery
	ManagementProduct  *management_product.HttpDelivery
	ManagementOrder    *management_order.HttpDelivery
	ManagementCatalog  *management_catalog.HttpDelivery
	ManagementSection  *management_section.HttpDelivery
	ManagementCategory *management_category.HttpDelivery
	Client             *client.HttpDelivery
}

func NewHandler(c *mongo.Client, clientUri string, s *service.Services, l logger.Logger) *Handler {
	return &Handler{
		Middleware:         middleware2.New(l, c, s.Auth),
		Auth:               auth.NewHttpDelivery(l, clientUri, s.Auth),
		User:               current_user.NewHttpDelivery(l, s.CurrentUser),
		ManagementUser:     management_user.NewHttpDelivery(l, s.ManagementUser),
		ManagementProduct:  management_product.NewHttpDelivery(l, s.ManagementProduct),
		ManagementOrder:    management_order.NewHttpDelivery(l, s.ManagementOrder),
		ManagementCatalog:  management_catalog.NewHttpDelivery(l, s.ManagementCatalog),
		ManagementSection:  management_section.NewHttpDelivery(l, s.ManagementSection),
		ManagementCategory: management_category.NewHttpDelivery(l, s.ManagementCategory),
		Client:             client.NewHttpDelivery(l, s.Client),
	}
}

func (h *Handler) InitRoutes(isDevMode bool) *chi.Mux {
	r := chi.NewRouter()

	if isDevMode {
		r.Use(cors.Handler(cors.Options{
			AllowedOrigins: []string{
				"http://localhost:3000", "https://localhost:3000",
			},
			AllowedMethods: []string{
				http.MethodHead,
				http.MethodGet,
				http.MethodPost,
				http.MethodPut,
				http.MethodPatch,
				http.MethodDelete,
			},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		}))
	} else {
		r.Use(cors.Handler(cors.Options{
			AllowedOrigins: []string{
				"https://admin.ardogroup.org",
			},
			AllowedMethods: []string{
				http.MethodHead,
				http.MethodGet,
				http.MethodPost,
				http.MethodPut,
				http.MethodPatch,
				http.MethodDelete,
			},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		}))
	}

	r.Use(h.Middleware.Recover)
	r.Use(h.Middleware.Trace)
	r.Use(h.Middleware.RequestInfo)
	r.Use(h.Middleware.WithTransaction)
	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)

	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Use(h.Middleware.NoAuth)
			r.Post("/login", h.Auth.Login)
			r.With(h.Middleware.UserAuth).Post("/logout", h.Auth.Logout)
			r.Post("/register", h.Auth.Register)
			r.With(h.Middleware.ConfirmationLink).Get("/confirm/{link}", h.Auth.Confirm)
		})

		r.Route("/me", func(r chi.Router) {
			r.Use(h.Middleware.UserAuth)
			r.Get("/", h.User.GetCurrentUser)
			r.Put("/credentials", h.User.UpdateCurrentUserCredentials)
			r.Put("/email", h.User.UpdateCurrentUserEmail)
			r.Put("/preferred-lang", h.User.UpdateCurrentUserPreferredLang)
			r.Put("/password", h.User.UpdateCurrentUserPassword)
		})

		r.Route("/management", func(r chi.Router) {
			r.Use(h.Middleware.StaffAuth)
			r.Route("/users", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementUser.GetUsersByFilters)
				r.Get("/{user_id}", h.ManagementUser.GetUserById)
				r.Post("/", h.ManagementUser.AddUser)
				r.Put("/credentials/{user_id}", h.ManagementUser.UpdateUserCredentials)
				r.Put("/email/{user_id}", h.ManagementUser.UpdateUserEmail)
				r.Put("/preferred-lang/{user_id}", h.ManagementUser.UpdateUserPreferredLang)
				r.Put("/password/{user_id}", h.ManagementUser.UpdateUserPassword)
				r.Put("/{user_id}", h.ManagementUser.RecoverUser)
				r.Delete("/{user_id}", h.ManagementUser.DeleteUser)
			})

			r.Route("/products", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementProduct.GetProductsByFilters)
				r.Get("/{product_id}", h.ManagementProduct.GetProductById)
				r.Post("/", h.ManagementProduct.AddProduct)
				r.Put("/credentials/{product_id}", h.ManagementProduct.UpdateProduct)
				r.Put("/{product_id}", h.ManagementProduct.RecoverProduct)
				r.Delete("/{product_id}", h.ManagementProduct.DeleteProduct)
			})

			r.Route("/orders", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementOrder.GetOrdersByFilters)
				r.With(h.Middleware.PaginationParams).Get("/user/{user_id}", h.ManagementOrder.GetByUserId)
				r.Get("/{order_id}", h.ManagementOrder.GetOneById)
				r.Post("/", h.ManagementOrder.CreateOrder)
				r.Put("/status/{order_id}", h.ManagementOrder.UpdateOrderStatus)
				r.Put("/{order_id}", h.ManagementOrder.RecoverOrder)
				r.Delete("/{order_id}", h.ManagementOrder.DeleteOrder)
			})

			r.Route("/catalog", func(r chi.Router) {
				r.Get("/", h.ManagementCatalog.GetAllCatalogs)
				r.Get("/{catalog_id}", h.ManagementCatalog.GetCatalogById)
				r.Post("/", h.ManagementCatalog.CreateCatalog)
				r.Put("/{catalog_id}", h.ManagementCatalog.UpdateCatalog)
				r.Post("/publish/{catalog_id}", h.ManagementCatalog.PublishCatalog)
			})

			r.Route("/sections", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementSection.GetSectionsByFilters)
				r.Get("/{section_id}", h.ManagementSection.GetSectionById)
				r.Post("/", h.ManagementSection.CreateSection)
				r.Put("/{section_id}", h.ManagementSection.UpdateSection)
				r.Put("/recover/{section_id}", h.ManagementSection.RecoverSection)
				r.Delete("/{section_id}", h.ManagementSection.DeleteSection)
			})

			r.Route("/categories", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementCategory.GetCategoriesByFilters)
				r.Get("/{category_id}", h.ManagementCategory.GetCategoryById)
				r.Post("/", h.ManagementCategory.CreateCategory)
				r.Put("/{category_id}", h.ManagementCategory.UpdateCategory)
				r.Put("/recover/{category_id}", h.ManagementCategory.RecoverCategory)
				r.Delete("/{category_id}", h.ManagementCategory.DeleteCategory)
			})
		})

		r.Route("/make-order", func(r chi.Router) {
			r.Use(h.Middleware.UserAuth)
			r.Post("/", h.Client.MakeOrder)
		})
	})
	return r
}
