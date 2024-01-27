package auth

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/pkg/web"
	service "github/nnniyaz/ardo/service/auth"
	"net/http"
	"time"
)

type HttpDelivery struct {
	service   service.AuthService
	logger    logger.Logger
	clientUri string
}

func NewHttpDelivery(s service.AuthService, l logger.Logger, clientUri string) *HttpDelivery {
	return &HttpDelivery{service: s, logger: l, clientUri: clientUri}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type LoginIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

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
		Name:     "session",
		Value:    token.String(),
		MaxAge:   time.Now().Add(time.Second*1800).Nanosecond() / 1000000,
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err = hd.service.Logout(r.Context(), cookie.Value); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type RegisterIn struct {
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	Email         string `json:"email"`
	Password      string `json:"password"`
	PreferredLang string `json:"preferredLang"`
}

func (hd *HttpDelivery) Register(w http.ResponseWriter, r *http.Request) {
	in := RegisterIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	err := hd.service.Register(r.Context(), in.FirstName, in.LastName, in.Email, in.Password, in.PreferredLang)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) Confirm(w http.ResponseWriter, r *http.Request) {
	link := chi.URLParam(r, "link")
	err := hd.service.Confirm(r.Context(), link)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	http.Redirect(w, r, hd.clientUri, http.StatusTemporaryRedirect)
}
