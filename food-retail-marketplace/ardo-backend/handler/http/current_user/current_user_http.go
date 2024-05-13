package current_user

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
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
	Id        string `json:"id"`
	Code      string `json:"code"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Phone     struct {
		Number      string `json:"number"`
		CountryCode string `json:"countryCode"`
	} `json:"phone"`
	DeliveryPoints []struct {
		Id              string `json:"id"`
		Address         string `json:"address"`
		Floor           string `json:"floor"`
		Apartment       string `json:"apartment"`
		DeliveryComment string `json:"deliveryComment"`
	} `json:"deliveryPoints"`
	LastDeliveryPoint struct {
		Id              string `json:"id"`
		Address         string `json:"address"`
		Floor           string `json:"floor"`
		Apartment       string `json:"apartment"`
		DeliveryComment string `json:"deliveryComment"`
	} `json:"lastDeliveryPoint"`
	UserType      string    `json:"userType"`
	PreferredLang string    `json:"preferredLang"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	Version       int       `json:"version"`
}

func newUser(u *user.User) User {
	userPhone := u.GetPhone()
	deliveryPoints := make([]struct {
		Id              string `json:"id"`
		Address         string `json:"address"`
		Floor           string `json:"floor"`
		Apartment       string `json:"apartment"`
		DeliveryComment string `json:"deliveryComment"`
	}, len(u.GetDeliveryPoints()))
	for i, dp := range u.GetDeliveryPoints() {
		deliveryPoints[i] = struct {
			Id              string `json:"id"`
			Address         string `json:"address"`
			Floor           string `json:"floor"`
			Apartment       string `json:"apartment"`
			DeliveryComment string `json:"deliveryComment"`
		}{
			Id:              dp.GetId().String(),
			Address:         dp.GetAddress(),
			Floor:           dp.GetFloor(),
			Apartment:       dp.GetApartment(),
			DeliveryComment: dp.GetDeliveryComment(),
		}
	}
	deliveryPoint := u.GetLastDeliveryPoint()

	return User{
		Id:        u.GetId().String(),
		Code:      u.GetCode().String(),
		FirstName: u.GetFirstName().String(),
		LastName:  u.GetLastName().String(),
		Email:     u.GetEmail().String(),
		Phone: struct {
			Number      string `json:"number"`
			CountryCode string `json:"countryCode"`
		}{
			Number:      userPhone.GetNumber(),
			CountryCode: userPhone.GetCountryCode(),
		},
		DeliveryPoints: deliveryPoints,
		LastDeliveryPoint: struct {
			Id              string `json:"id"`
			Address         string `json:"address"`
			Floor           string `json:"floor"`
			Apartment       string `json:"apartment"`
			DeliveryComment string `json:"deliveryComment"`
		}{
			Id:              deliveryPoint.GetId().String(),
			Address:         deliveryPoint.GetAddress(),
			Floor:           deliveryPoint.GetFloor(),
			Apartment:       deliveryPoint.GetApartment(),
			DeliveryComment: deliveryPoint.GetDeliveryComment(),
		},
		UserType:      u.GetUserType().String(),
		PreferredLang: u.GetUserPreferredLang().String(),
		CreatedAt:     u.GetCreatedAt(),
		UpdatedAt:     u.GetUpdatedAt(),
		Version:       u.GetVersion(),
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

type AddCurrentUserDeliveryPointIn struct {
	Address         string `json:"address"`
	Floor           string `json:"floor"`
	Apartment       string `json:"apartment"`
	DeliveryComment string `json:"deliveryComment"`
}

// AddCurrentUserDeliveryPoint godoc
//
//	@Summary		Add current user delivery point
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		AddCurrentUserDeliveryPointIn	true	"Add current user delivery point object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/delivery-point [post]

func (hd *HttpDelivery) AddCurrentUserDeliveryPoint(w http.ResponseWriter, r *http.Request) {
	var in AddCurrentUserDeliveryPointIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	userNewDeliveryInfo, err := deliveryInfo.NewDeliveryInfo(in.Address, in.Floor, in.Apartment, in.DeliveryComment)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	err = hd.service.AddDeliveryPoint(r.Context(), &u, userNewDeliveryInfo)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateCurrentUserDeliveryPointIn struct {
	Id              string `json:"id"`
	Address         string `json:"address"`
	Floor           string `json:"floor"`
	Apartment       string `json:"apartment"`
	DeliveryComment string `json:"deliveryComment"`
}

// UpdateCurrentUserDeliveryPoint godoc
//
//	@Summary		Update current user delivery point
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateCurrentUserDeliveryPointIn	true	"Update current user delivery point object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/delivery-point [put]

func (hd *HttpDelivery) UpdateCurrentUserDeliveryPoint(w http.ResponseWriter, r *http.Request) {
	var in UpdateCurrentUserDeliveryPointIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.UpdateDeliveryPoint(r.Context(), &u, in.Id, in.Address, in.Floor, in.Apartment, in.DeliveryComment)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteCurrentUserDeliveryPoint godoc
//
//	@Summary		Delete current user delivery point
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/delivery-point/{delivery_point_id} [delete]

func (hd *HttpDelivery) DeleteCurrentUserDeliveryPoint(w http.ResponseWriter, r *http.Request) {
	deliveryPointId := chi.URLParam(r, "delivery_point_id")
	u := r.Context().Value("user").(user.User)
	err := hd.service.DeleteDeliveryPoint(r.Context(), &u, deliveryPointId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type ChangeCurrentUserLastDeliveryPointIn struct {
	DeliveryPointId string `json:"deliveryPointId"`
}

// ChangeCurrentUserLastDeliveryPoint godoc
//
//	@Summary		Change current user last delivery point
//	@Description	This can only be done by the logged-in user.
//	@Tags			Current User
//	@Accept			json
//	@Produce		json
//	@Param			data	body		ChangeCurrentUserLastDeliveryPointIn	true	"Change current user last delivery point object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/me/delivery-point [put]

func (hd *HttpDelivery) ChangeCurrentUserLastDeliveryPoint(w http.ResponseWriter, r *http.Request) {
	var in ChangeCurrentUserLastDeliveryPointIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)
	err := hd.service.ChangeLastDeliveryPoint(r.Context(), &u, in.DeliveryPointId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
