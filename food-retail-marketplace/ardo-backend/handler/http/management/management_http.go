package management

import (
	"encoding/json"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	service "github/nnniyaz/ardo/service/management"
	"net/http"
)

type HttpDelivery struct {
	service service.ManagementService
	logger  logger.Logger
}

func NewHttpDelivery(s service.ManagementService, l logger.Logger) *HttpDelivery {
	return &HttpDelivery{service: s, logger: l}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	users, err := hd.service.GetUsersByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, users)
}

func (hd *HttpDelivery) GetById(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("user_id").(string)
	user, err := hd.service.GetUserById(r.Context(), userId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, user)
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type AddUserRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	UserType  string `json:"userType"`
}

func (hd *HttpDelivery) AddUser(w http.ResponseWriter, r *http.Request) {
	in := AddUserRequest{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	if err := hd.service.AddUser(r.Context(), in.FirstName, in.LastName, in.Email, in.Password, in.UserType); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserCredentialsRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

func (hd *HttpDelivery) UpdateUserCredentials(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("user_id").(string)
	in := UpdateUserCredentialsRequest{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.UpdateUserCredentials(r.Context(), userId, in.FirstName, in.LastName, in.Email); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserPasswordRequest struct {
	Password string `json:"password"`
}

func (hd *HttpDelivery) UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("user_id").(string)
	in := UpdateUserPasswordRequest{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.UpdateUserPassword(r.Context(), userId, in.Password); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("user_id").(string)
	if err := hd.service.DeleteUser(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}
