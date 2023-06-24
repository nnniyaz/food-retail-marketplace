package user

import (
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	service "github/nnniyaz/ardo/service/user"
	"net/http"
	"time"
)

var (
	ErrUserDoesNotExist = core.NewI18NError(core.EINVALID, http.StatusNotFound)
)

type HttpDelivery struct {
	service service.UserService
	logger  logger.Logger
}

func NewHttpDelivery(s service.UserService, l logger.Logger) *HttpDelivery {
	return &HttpDelivery{service: s, logger: l}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) UpdateCurrentUserCredentials(w http.ResponseWriter, r *http.Request) {

}

func (hd *HttpDelivery) UpdateCurrentUserPassword(w http.ResponseWriter, r *http.Request) {

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
