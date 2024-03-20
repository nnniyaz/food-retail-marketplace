package current_user

import (
	"encoding/json"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	currentUserService "github/nnniyaz/ardo/service/current_user"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service currentUserService.CurrentUserService
}

func NewHttpDelivery(l logger.Logger, s currentUserService.CurrentUserService) *HttpDelivery {
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
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func newUser(u *user.User) User {
	return User{
		Id:            u.GetId().String(),
		Email:         u.GetEmail().String(),
		FirstName:     u.GetFirstName().String(),
		LastName:      u.GetLastName().String(),
		UserType:      u.GetUserType().String(),
		PreferredLang: u.GetUserPreferredLang().String(),
		CreatedAt:     u.GetCreatedAt(),
		UpdatedAt:     u.GetUpdatedAt(),
	}
}

// GetCurrentUser godoc
//
//	@Summary		Get current user
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=User}
//	@Failure		default	{object}	response.Error
//	@Router			/me [get]
func (hd *HttpDelivery) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(user.User)
	response.NewSuccess(hd.logger, w, r, newUser(&u))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type UpdateCurrentUserCredentialsIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

// UpdateCurrentUserCredentials godoc
//
//	@Summary		Update current user credentials
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateCurrentUserCredentialsIn	true	"Make order object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/credentials [put]
func (hd *HttpDelivery) UpdateCurrentUserCredentials(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentUserCredentialsIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.UpdateCredentials(r.Context(), &u, in.FirstName, in.LastName)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateCurrentUserEmailIn struct {
	Email string `json:"email"`
}

// UpdateCurrentUserEmail godoc
//
//	@Summary		Update current user email
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateCurrentUserEmailIn	true	"Update current user email object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/email [put]
func (hd *HttpDelivery) UpdateCurrentUserEmail(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentUserEmailIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.UpdateEmail(r.Context(), &u, in.Email)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateCurrentLanguageIn struct {
	Lang string `json:"lang"`
}

// UpdateCurrentUserPreferredLang godoc
//
//	@Summary		Update current user preferred language
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateCurrentLanguageIn	true	"Update current user preferred language object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/preferred-lang [put]
func (hd *HttpDelivery) UpdateCurrentUserPreferredLang(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentLanguageIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.UpdatePreferredLang(r.Context(), &u, in.Lang)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateCurrentUserPasswordIn struct {
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}

// UpdateCurrentUserPassword godoc
//
//	@Summary		Update current user password
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateCurrentUserPasswordIn	true	"Update current user password object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/password [put]
func (hd *HttpDelivery) UpdateCurrentUserPassword(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentUserPasswordIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.ChangePassword(r.Context(), &u, in.OldPassword, in.NewPassword)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
