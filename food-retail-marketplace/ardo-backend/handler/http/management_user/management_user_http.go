package management_user

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementUserService
}

func NewHttpDelivery(l logger.Logger, s management.ManagementUserService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: s}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type User struct {
	Id            string    `json:"id"`
	Email         string    `json:"email"`
	FirstName     string    `json:"firstName"`
	LastName      string    `json:"lastName"`
	UserType      string    `json:"userType"`
	PreferredLang string    `json:"preferredLang"`
	IsDeleted     bool      `json:"isDeleted"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	Version       int       `json:"version"`
}

func NewUser(u *user.User) User {
	return User{
		Id:            u.GetId().String(),
		Email:         u.GetEmail().String(),
		FirstName:     u.GetFirstName().String(),
		LastName:      u.GetLastName().String(),
		UserType:      u.GetUserType().String(),
		PreferredLang: u.GetUserPreferredLang().String(),
		IsDeleted:     u.GetIsDeleted(),
		CreatedAt:     u.GetCreatedAt(),
		UpdatedAt:     u.GetUpdatedAt(),
		Version:       u.GetVersion(),
	}
}

type UsersData struct {
	Users []User `json:"users"`
	Count int64  `json:"count"`
}

func NewUsers(users []*user.User, count int64) UsersData {
	var us []User
	for _, u := range users {
		us = append(us, NewUser(u))
	}
	return UsersData{Users: us, Count: count}
}

// GetUsersByFilters godoc
//
//	@Summary		Get users by filters
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Param			offset		query		int		false	"Offset"
//	@Param			limit		query		int		false	"Limit"
//	@Param			is_deleted	query		bool	false	"Is deleted"
//	@Success		200			{object}	response.Success{data=UsersData}
//	@Failure		default		{object}	response.Error
//	@Router			/management/users [get]
func (hd *HttpDelivery) GetUsersByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	users, count, err := hd.service.GetUsersByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewUsers(users, count))
}

// GetUserById godoc
//
//	@Summary		Get user by id
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=User}
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/{user_id} [get]
func (hd *HttpDelivery) GetUserById(w http.ResponseWriter, r *http.Request) {
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
	FirstName       string `json:"firstName"`
	LastName        string `json:"lastName"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
	Password        string `json:"password"`
	UserType        string `json:"userType"`
	PreferredLang   string `json:"preferredLang"`
	Address         string `json:"address"`
	Floor           string `json:"floor"`
	Apartment       string `json:"apartment"`
	DeliveryComment string `json:"deliveryComment"`
}

// AddUser godoc
//
//	@Summary		Add user
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Param			data	body		AddUserIn	true	"Add user object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users [post]
func (hd *HttpDelivery) AddUser(w http.ResponseWriter, r *http.Request) {
	in := AddUserIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.AddUser(r.Context(), in.FirstName, in.LastName, in.Email, in.Phone, in.Password, in.UserType, in.PreferredLang, in.Address, in.Floor, in.Apartment, in.DeliveryComment); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserCredentialsIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// UpdateUserCredentials godoc
//
//	@Summary		Update user credentials
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateUserCredentialsIn	true	"Update user credentials object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/credentials/{user_id} [put]
func (hd *HttpDelivery) UpdateUserCredentials(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	in := UpdateUserCredentialsIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateUserCredentials(r.Context(), userId, in.FirstName, in.LastName); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserEmailIn struct {
	Email string `json:"email"`
}

// UpdateUserEmail godoc
//
//	@Summary		Update user email
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateUserEmailIn	true	"Update user email object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/email/{user_id} [put]
func (hd *HttpDelivery) UpdateUserEmail(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	in := UpdateUserEmailIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateUserEmail(r.Context(), userId, in.Email); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserPreferredLangIn struct {
	Lang string `json:"lang"`
}

// UpdateUserPreferredLang godoc
//
//	@Summary		Update user preferred lang
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateUserPreferredLangIn	true	"Update user preferred lang object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/preferred-lang/{user_id} [put]
func (hd *HttpDelivery) UpdateUserPreferredLang(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	in := UpdateUserPreferredLangIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateUserPreferredLang(r.Context(), userId, in.Lang); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserPasswordIn struct {
	Password string `json:"password"`
}

// UpdateUserPassword godoc
//
//	@Summary		Update user preferred lang
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateUserPasswordIn	true	"Update user password object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/password/{user_id} [put]
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

// RecoverUser godoc
//
//	@Summary		Recover user
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/recover/{user_id} [put]
func (hd *HttpDelivery) RecoverUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.RecoverUser(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteUser godoc
//
//	@Summary		Delete user
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Users
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/users/{user_id} [delete]
func (hd *HttpDelivery) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.DeleteUser(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
