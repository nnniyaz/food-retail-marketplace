package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github/nnniyaz/ardo/handler/http/auth"
	"github/nnniyaz/ardo/handler/http/currentUser"
	"github/nnniyaz/ardo/handler/http/management"
	middleware2 "github/nnniyaz/ardo/handler/http/middleware"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service"
	"net/http"
)

type Handler struct {
	Auth       *auth.HttpDelivery
	Management *management.HttpDelivery
	Middleware *middleware2.Middleware
	User       *currentUser.HttpDelivery
}

func NewHandler(s *service.Services, l logger.Logger, clientUri string) *Handler {
	return &Handler{
		Auth:       auth.NewHttpDelivery(s.Auth, l, clientUri),
		Management: management.NewHttpDelivery(s.Management, l),
		Middleware: middleware2.New(s.Auth, l),
		User:       currentUser.NewHttpDelivery(s.CurrentUser, l),
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

			r.Route("/confirm/{link}", func(r chi.Router) {
				r.Use(h.Middleware.ConfirmationLink)
				r.Get("/", h.Auth.Confirm)
			})
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
				r.With(h.Middleware.PaginationParams).Get("/", h.Management.GetAllUsers)
				r.Get("/{user_id}", h.Management.GetById)
				r.Post("/", h.Management.AddUser)
				r.Put("/{user_id}", h.Management.UpdateUserCredentials)
				r.Put("/{user_id}/password", h.Management.UpdateUserPassword)
				r.Delete("/{user_id}", h.Management.DeleteUser)
			})
		})
	})
	return r
}
