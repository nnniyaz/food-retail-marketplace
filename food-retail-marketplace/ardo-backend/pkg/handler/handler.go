package handler

import (
	"github.com/gin-gonic/gin"
	"github/nnniyaz/ardo/pkg/service"
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.Default()

	auth := router.Group("/auth")
	{
		auth.POST("/login", h.login)
		auth.POST("/logout", h.logout)
		auth.POST("/register", h.register)
		auth.GET("/confirm/:link", h.confirm)
	}

	api := router.Group("/api")
	{
		users := api.Group("/users")
		{
			users.GET("/", h.getUsers)
			users.GET("/:id", h.getUser)
			users.POST("/", h.createUser)
			users.PUT("/:id", h.updateUser)
			users.DELETE("/:id", h.deleteUser)
		}
	}

	return router
}
