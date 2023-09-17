package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github/nnniyaz/ardo/handler/http/auth"
	"github/nnniyaz/ardo/handler/http/current_user"
	"github/nnniyaz/ardo/handler/http/management_org"
	"github/nnniyaz/ardo/handler/http/management_user"
	middleware2 "github/nnniyaz/ardo/handler/http/middleware"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service"
	"net/http"
)

type Handler struct {
	Auth           *auth.HttpDelivery
	ManagementUser *management_user.HttpDelivery
	ManagementOrg  *management_org.HttpDelivery
	Middleware     *middleware2.Middleware
	User           *current_user.HttpDelivery
}

func NewHandler(s *service.Services, l logger.Logger, clientUri string) *Handler {
	return &Handler{
		Auth:           auth.NewHttpDelivery(s.Auth, l, clientUri),
		ManagementUser: management_user.NewHttpDelivery(s.ManagementUser, l),
		ManagementOrg:  management_org.NewHttpDelivery(s.ManagementOrganization, l),
		Middleware:     middleware2.New(s.Auth, l),
		User:           current_user.NewHttpDelivery(s.CurrentUser, l),
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
	}

	r.Use(h.Middleware.Trace)
	r.Use(h.Middleware.RequestInfo)
	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)

	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Use(h.Middleware.NoAuth)
			r.Post("/login", h.Auth.Login)
			r.Post("/logout", h.Auth.Logout)
			r.Post("/register", h.Auth.Register)
			r.With(h.Middleware.ConfirmationLink).Get("/confirm/{link}", h.Auth.Confirm)
		})

		r.Route("/me", func(r chi.Router) {
			r.Use(h.Middleware.UserAuth)
			r.Get("/", h.User.GetCurrentUser)
			r.Put("/", h.User.UpdateCurrentUserCredentials)
			r.Put("/password", h.User.UpdateCurrentUserPassword)
		})

		r.Route("/management", func(r chi.Router) {
			r.Use(h.Middleware.StaffAuth)
			r.Route("/users", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementUser.GetUsersByFilters)
				r.Get("/{user_id}", h.ManagementUser.GetUserById)
				r.Post("/", h.ManagementUser.AddUser)
				r.Put("/{user_id}", h.ManagementUser.UpdateUserCredentials)
				r.Put("/{user_id}/password", h.ManagementUser.UpdateUserPassword)
				r.Put("/{user_id}/recover", h.ManagementUser.RecoverUser)
				r.Delete("/{user_id}", h.ManagementUser.DeleteUser)
			})

			r.Route("/organizations", func(r chi.Router) {
				r.With(h.Middleware.PaginationParams).Get("/", h.ManagementOrg.GetOrgsByFilters)
				r.Get("/{org_id}", h.ManagementOrg.GetOrgById)
				r.Post("/", h.ManagementOrg.AddOrg)
				r.Put("/{org_id}", h.ManagementOrg.UpdateOrgInfo)
				r.Put("/{org_id}/logo", h.ManagementOrg.UpdateOrgLogo)
				r.Delete("/{org_id}", h.ManagementOrg.DeleteOrg)
				r.With(h.Middleware.PaginationParams).Get("/{org_id}/users", h.ManagementOrg.GetUsersByOrgId)
				r.Post("/{org_id}/users", h.ManagementOrg.AddUserToOrg)
			})
		})

		r.Route("/upload", func(r chi.Router) {
			r.Use(h.Middleware.UserAuth)
			r.Post("/organization-logo", h.User.UploadFile)
		})
	})
	return r
}
