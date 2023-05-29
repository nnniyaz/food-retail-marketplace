package user

import (
	"github.com/gin-gonic/gin"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/handler/http/response"
	service "github/nnniyaz/ardo/service/user"
	"net/http"
)

const (
	userCreatedSuccessfully = "user created successfully"
	wrongDataFormat         = "wrong data format"
	internalStatusError     = "internal status error"
	authorizedSuccessfully  = "authorized successfully"
	loggedOutSuccessfully   = "logged out successfully"
	wrongUUIDFormat         = "wrong uuid format"
)

type HttpDelivery struct {
	service service.UserService
}

func NewHttpDelivery(service service.UserService) *HttpDelivery {
	return &HttpDelivery{service: service}
}

type CreateUserRequest struct {
	email    string `json:"email"`
	password string `json:"password"`
	fistName string `json:"firstName"`
	lastName string `json:"lastName"`
	userType string `json:"userType"`
}

func (h *HttpDelivery) Create(c *gin.Context) {
	candidate := CreateUserRequest{}
	if err := c.BindJSON(&candidate); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(wrongDataFormat))
		return
	}

	email, err := base.NewEmail(candidate.email)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	userType, err := base.NewUserType(candidate.userType)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	if err = h.service.Create(c, domain.User{Email: email, Password: candidate.password, FirstName: candidate.fistName, LastName: candidate.lastName, UserType: userType}); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
	}

	c.JSON(http.StatusOK, response.SuccessResponse(userCreatedSuccessfully, nil))
}

type GetAllRequest struct {
	limit       int  `json:"limit"`
	offset      int  `json:"offset"`
	isDeleted   bool `json:"isDeleted"`
	isActivated bool `json:"isActivated"`
}

func (h *HttpDelivery) GetAll(c *gin.Context) {

}

func (h *HttpDelivery) GetById(c *gin.Context) {

}

type UpdateRequest struct {
	user domain.User `json:"user"`
}

func (h *HttpDelivery) Update(c *gin.Context) {

}

func (h *HttpDelivery) Delete(c *gin.Context) {

}
