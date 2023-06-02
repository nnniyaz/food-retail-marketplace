package http

import (
	"github.com/gin-gonic/gin"
	"github/nnniyaz/ardo/handler/http/auth"
	"github/nnniyaz/ardo/handler/http/management"
	"github/nnniyaz/ardo/service"
)

type Handler struct {
	Auth       *auth.HttpDelivery
	Management *management.HttpDelivery
}

func NewHandler(s *service.Services) *Handler {
	return &Handler{
		Auth:       auth.NewHttpDelivery(s.Auth),
		Management: management.NewHttpDelivery(s.Management),
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		authentication := api.Group("/auth")
		authentication.Use()
		{
			authentication.POST("/login", h.Auth.Login)
			authentication.POST("/logout", h.Auth.Logout)
			authentication.POST("/register", h.Auth.Register)
			authentication.GET("/confirm/:link", h.Auth.Confirm)
		}

		users := api.Group("/users")
		{
			users.GET("/", h.Management.GetAllUsers)
			users.GET("/:id", h.Management.GetById)
			users.POST("/", h.Management.AddUser)
			users.PUT("/:id", h.Management.UpdateUserCredentials)
			users.PUT("/:id", h.Management.UpdateUserPassword)
			users.DELETE("/:id", h.Management.DeleteUser)
		}
	}

	return r
}
