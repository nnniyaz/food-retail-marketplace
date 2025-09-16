package auth

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/pkg/web"
	service "github/nnniyaz/ardo/service/auth"
	"net/http"
)

type HttpDelivery struct {
	logger    logger.Logger
	clientUri string
	service   service.AuthService
}

func NewHttpDelivery(l logger.Logger, clientUri string, s service.AuthService) *HttpDelivery {
	return &HttpDelivery{logger: l, clientUri: clientUri, service: s}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type LoginIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login godoc
//
//	@Summary		Login
//	@Description	This can only be done by the unauthenticated user.
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			data	body		LoginIn	true	"User login object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/auth/login [post]
func (hd *HttpDelivery) Login(w http.ResponseWriter, r *http.Request) {
	requestInfo := r.Context().Value("requestInfo").(web.RequestInfo)

	var in LoginIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	token, err := hd.service.Login(r.Context(), in.Email, in.Password, requestInfo.UserAgent.String)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "ardo-app-session",
		Value:    token.String(),
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	response.NewSuccess(hd.logger, w, r, nil)
}

type LoginStaffIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Logout godoc
//
//	@Summary		Logout
//	@Description	This can only be done by the logged-in user.
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/auth/logout [post]
func (hd *HttpDelivery) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("ardo-app-session")
	if err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err = hd.service.Logout(r.Context(), cookie.Value); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "ardo-app-session",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	response.NewSuccess(hd.logger, w, r, nil)
}

type RegisterIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     struct {
		Number      string `json:"number"`
		CountryCode string `json:"countryCode"`
	} `json:"phone"`
	Password        string `json:"password"`
	PreferredLang   string `json:"preferredLang"`
	Address         string `json:"address"`
	Apartment       string `json:"apartment"`
	Floor           string `json:"floor"`
	DeliveryComment string `json:"deliveryComment"`
}

// Register godoc
//
//	@Summary		Register
//	@Description	This can only be done by the unauthenticated user.
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Param			data	body		RegisterIn	true	"New user object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/auth/register [post]
func (hd *HttpDelivery) Register(w http.ResponseWriter, r *http.Request) {
	in := RegisterIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	err := hd.service.Register(r.Context(), in.FirstName, in.LastName, in.Email, in.Phone.Number, in.Phone.CountryCode, in.Password, in.PreferredLang, in.Address, in.Floor, in.Apartment, in.DeliveryComment)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// Confirm godoc
//
//	@Summary		Confirm activation link
//	@Description	This can only be done by the unauthenticated user.
//	@Tags			Auth
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/auth/confirm/{link} [get]
func (hd *HttpDelivery) Confirm(w http.ResponseWriter, r *http.Request) {
	link := chi.URLParam(r, "link")
	err := hd.service.Confirm(r.Context(), link)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	http.Redirect(w, r, hd.clientUri, http.StatusTemporaryRedirect)
}
