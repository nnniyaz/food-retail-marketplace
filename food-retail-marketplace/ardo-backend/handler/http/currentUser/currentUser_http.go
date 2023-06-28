package currentUser

import (
	"encoding/json"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	currentUserService "github/nnniyaz/ardo/service/currentUser"
	"net/http"
	"time"
)

var (
	ErrUserDoesNotExist = core.NewI18NError(core.EINVALID, http.StatusNotFound)
)

type HttpDelivery struct {
	service currentUserService.CurrentUserService
	logger  logger.Logger
}

func NewHttpDelivery(s currentUserService.CurrentUserService, l logger.Logger) *HttpDelivery {
	return &HttpDelivery{service: s, logger: l}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type UpdateCurrentUserCredentialsIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

func (hd *HttpDelivery) UpdateCurrentUserCredentials(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentUserCredentialsIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.UpdateCredentials(r.Context(), u.GetId().String(), in.FirstName, in.LastName, in.Email)
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

func (hd *HttpDelivery) UpdateCurrentUserPassword(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentUserPasswordIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.ChangePassword(r.Context(), u.GetId().String(), in.OldPassword, in.NewPassword)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
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

func newUser(u *user.User) User {
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

func (hd *HttpDelivery) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(user.User)
	response.NewSuccess(hd.logger, w, r, newUser(&u))
}
