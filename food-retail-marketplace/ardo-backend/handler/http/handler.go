package http

import (
	"github.com/gin-gonic/gin"
	"github/nnniyaz/ardo/handler/http/auth"
	"github/nnniyaz/ardo/service"
)

type Handler struct {
	Auth *auth.HttpDelivery
}

func NewHandler(s *service.Services) *Handler {
	return &Handler{
		Auth: auth.NewHttpDelivery(s.Auth),
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")
	{
		authentication := api.Group("/auth")
		{
			authentication.POST("/login", h.Auth.Login)
			authentication.POST("/logout", h.Auth.Logout)
			authentication.POST("/register", h.Auth.Register)
			authentication.GET("/confirm/:link", h.Auth.Confirm)
		}

		//users := api.Group("/users")
		//{
		//	users.GET("/", h.User.GetAll)
		//	users.GET("/:id", h.User.GetById)
		//	users.POST("/", h.User.Create)
		//	users.PUT("/", h.User.Update)
		//	users.DELETE("/:id", h.User.Delete)
		//}
	}

	return router
}
