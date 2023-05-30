package auth

import (
	"github.com/gin-gonic/gin"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/env"
	service "github/nnniyaz/ardo/service/auth"
	"net/http"
)

type HttpDelivery struct {
	service service.AuthService
}

func NewHttpDelivery(s service.AuthService) *HttpDelivery {
	return &HttpDelivery{service: s}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (hd *HttpDelivery) Login(c *gin.Context) {
	r := LoginRequest{}
	if err := c.BindJSON(&r); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	token, err := hd.service.Login(c, r.Email, r.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session",
		Value:    token.String(),
		HttpOnly: true,
	})
	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}

func (hd *HttpDelivery) Logout(c *gin.Context) {
	cookie, err := c.Cookie("session")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, response.ErrorResponse(err.Error()))
		return
	}

	err = hd.service.Logout(c, cookie)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}

type RegisterIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func (hd *HttpDelivery) Register(c *gin.Context) {
	r := RegisterIn{}
	if err := c.BindJSON(&r); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	err := hd.service.Register(c, r.FirstName, r.LastName, r.Email, r.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}

func (hd *HttpDelivery) Confirm(c *gin.Context) {
	link := c.Param("link")
	err := hd.service.Confirm(c, link)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}
	c.Redirect(http.StatusTemporaryRedirect, env.MustGetEnv("CLIENT_URI"))
}
