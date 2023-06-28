package management

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	service "github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
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

type User struct {
	Id        string    `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	UserType  string    `json:"userType"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewUser(u *user.User) User {
	return User{
		Id:        u.GetId().String(),
		Email:     u.GetEmail().String(),
		FirstName: u.GetFirstName().String(),
		LastName:  u.GetLastName().String(),
		UserType:  u.GetUserType().String(),
		CreatedAt: u.GetCreatedAt(),
		UpdatedAt: u.GetUpdatedAt(),
	}
}

func NewUsers(users []*user.User) []User {
	var us []User
	for _, u := range users {
		us = append(us, NewUser(u))
	}
	return us
}

func (hd *HttpDelivery) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	users, err := hd.service.GetUsersByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, NewUsers(users))
}

func (hd *HttpDelivery) GetById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	u, err := hd.service.GetUserById(r.Context(), userId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, NewUser(u))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type AddUserIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	UserType  string `json:"userType"`
}

func (hd *HttpDelivery) AddUser(w http.ResponseWriter, r *http.Request) {
	in := AddUserIn{}
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

type UpdateUserCredentialsIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

func (hd *HttpDelivery) UpdateUserCredentials(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	in := UpdateUserCredentialsIn{}
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

type UpdateUserPasswordIn struct {
	Password string `json:"password"`
}

func (hd *HttpDelivery) UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	in := UpdateUserPasswordIn{}
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
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.DeleteUser(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}
