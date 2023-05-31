package management

import (
	"github.com/gin-gonic/gin"
	"github/nnniyaz/ardo/handler/http/response"
	service "github/nnniyaz/ardo/service/management"
	"net/http"
)

type HttpDelivery struct {
	service service.ManagementService
}

func NewHttpDelivery(s service.ManagementService) *HttpDelivery {
	return &HttpDelivery{service: s}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) GetAllUsers(c *gin.Context) {
	offset := c.Query("offset")
	limit := c.Query("limit")
	isDeleted := c.Query("is_deleted")
	users, err := hd.service.GetUsersByFilters(c, offset, limit, isDeleted)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(users))
}

func (hd *HttpDelivery) GetById(c *gin.Context) {
	userId := c.Query("user_id")
	user, err := hd.service.GetUserById(c, userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(user))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type AddUserRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	UserType  string `json:"user_type"`
}

func (hd *HttpDelivery) AddUser(c *gin.Context) {
	r := AddUserRequest{}
	if err := c.BindJSON(&r); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	err := hd.service.AddUser(c, r.FirstName, r.LastName, r.Email, r.Password, r.UserType)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}

type UpdateUserCredentialsRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

func (hd *HttpDelivery) UpdateUserCredentials(c *gin.Context) {
	userId := c.Query("user_id")
	r := UpdateUserCredentialsRequest{}
	if err := c.BindJSON(&r); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	err := hd.service.UpdateUserCredentials(c, userId, r.FirstName, r.LastName, r.Email)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}

type UpdateUserPasswordRequest struct {
	Password string `json:"password"`
}

func (hd *HttpDelivery) UpdateUserPassword(c *gin.Context) {
	userId := c.Query("user_id")
	r := UpdateUserPasswordRequest{}
	if err := c.BindJSON(&r); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, response.ErrorResponse(err.Error()))
		return
	}

	err := hd.service.UpdateUserPassword(c, userId, r.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}

func (hd *HttpDelivery) DeleteUser(c *gin.Context) {
	userId := c.Query("user_id")
	err := hd.service.DeleteUser(c, userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, response.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessResponse(nil))
}
