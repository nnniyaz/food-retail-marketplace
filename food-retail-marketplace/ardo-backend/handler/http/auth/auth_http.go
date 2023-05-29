package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/env"
	service "github/nnniyaz/ardo/service/auth"
	"net/http"
)

const (
	wrongDataFormat        = "wrong data format"
	internalStatusError    = "internal status error"
	authorizedSuccessfully = "authorized successfully"
	loggedOutSuccessfully  = "logged out successfully"
	wrongUUIDFormat        = "wrong uuid format"
	confirmEmailSent       = "confirmation was sent to email"
)

type HttpDelivery struct {
	service service.AuthService
}

func NewHttpDelivery(s service.AuthService) *HttpDelivery {
	return &HttpDelivery{service: s}
}

type LoginIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) Login(c *gin.Context) {
	login := LoginIn{}

	if err := c.BindJSON(&login); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(wrongDataFormat))
		return
	}

	email, err := base.NewEmail(login.Email)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	token, err := hd.service.Login(c, domain.Login{Email: email, Password: login.Password})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session",
		Value:    token.String(),
		HttpOnly: true,
	})

	c.JSON(http.StatusOK, response.SuccessResponse(authorizedSuccessfully, nil))
}

func (hd *HttpDelivery) Logout(c *gin.Context) {
	cookie, err := c.Cookie("session")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, response.ErrorResponse(err.Error()))
		return
	}

	token, err := uuid.FromString(cookie)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, response.ErrorResponse(err.Error()))
		return
	}

	err = hd.service.Logout(c, token)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(internalStatusError))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(loggedOutSuccessfully, nil))
}

type RegisterIn struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func (hd *HttpDelivery) Register(c *gin.Context) {
	register := RegisterIn{}

	if err := c.BindJSON(&register); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(wrongDataFormat))
		return
	}

	email, err := base.NewEmail(register.Email)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	err = hd.service.Register(c, domain.Register{
		Email:     email,
		Password:  register.Password,
		FirstName: register.FirstName,
		LastName:  register.LastName,
	})

	if err != nil {
		switch err {
		case base.ErrorEmailIsEmpty:
			fallthrough
		case domain.ErrorUserNotFound:
			fallthrough
		case domain.ErrorFirstNameIsEmpty:
			fallthrough
		case domain.ErrorFirstNameLessThan3:
			fallthrough
		case domain.ErrorFirstNameMoreThan50:
			fallthrough
		case domain.ErrorLastNameIsEmpty:
			fallthrough
		case domain.ErrorLastNameLessThan3:
			fallthrough
		case domain.ErrorLastNameMoreThan50:
			fallthrough
		case domain.ErrorPasswordIsEmpty:
			fallthrough
		case domain.ErrorPasswordLessThan3:
			fallthrough
		case domain.ErrorPasswordMoreThan32:
			fallthrough
		case base.ErrorEmailAlreadyExists:
			fallthrough
		case base.ErrorInvalidUserType:
			c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		default:
			c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(confirmEmailSent, nil))
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) Confirm(c *gin.Context) {
	link := c.Param("link")

	if link == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(wrongDataFormat))
		return
	}

	parsedLink, err := uuid.FromString(link)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(wrongUUIDFormat))
	}

	err = hd.service.Confirm(c, parsedLink)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, env.MustGetEnv("CLIENT_URI"))
}
