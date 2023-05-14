package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/pkg/errors"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/utils"
	"net/http"
)

const (
	wrongDataFormat        = "wrong data format"
	internalStatusError    = "internal status error"
	authorizedSuccessfully = "authorized successfully"
	loggedOutSuccessfully  = "logged out successfully"
)

type LoginIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) login(c *gin.Context) {
	login := LoginIn{}

	if err := c.BindJSON(&login); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, utils.ErrorResponse(wrongDataFormat))
		return
	}

	email, err := base.NewEmail(login.Email)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, utils.ErrorResponse(err.Error()))
		return
	}

	token, err := h.services.Authorization.Login(c, domain.Login{Email: email, Password: login.Password})

	if err != nil {
		if errors.Is(err, domain.ErrorUserNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, utils.ErrorResponse(err.Error()))
			return
		}
		c.AbortWithStatusJSON(http.StatusInternalServerError, utils.ErrorResponse(internalStatusError))
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session",
		Value:    token.String(),
		HttpOnly: true,
	})

	c.JSON(http.StatusOK, utils.SuccessResponse(authorizedSuccessfully, nil))
}

func (h *Handler) logout(c *gin.Context) {
	cookie, err := c.Cookie("session")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, utils.ErrorResponse(err.Error()))
		return
	}

	token, err := uuid.FromString(cookie)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, utils.ErrorResponse(err.Error()))
		return
	}

	err = h.services.Authorization.Logout(c, token)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, utils.ErrorResponse(internalStatusError))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(loggedOutSuccessfully, nil))
}

type RegisterIn struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func (h *Handler) register(c *gin.Context) {
	register := RegisterIn{}

	if err := c.BindJSON(&register); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, utils.ErrorResponse(wrongDataFormat))
		return
	}

	email, err := base.NewEmail(register.Email)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, utils.ErrorResponse(err.Error()))
		return
	}

	user, err := h.services.Authorization.Register(c, domain.Register{
		Email:     email,
		Password:  register.Password,
		FirstName: register.FirstName,
		LastName:  register.LastName,
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, utils.ErrorResponse(internalStatusError))
		return
	}

	c.JSON(http.StatusOK, utils.SuccessResponse(authorizedSuccessfully, user))
}
