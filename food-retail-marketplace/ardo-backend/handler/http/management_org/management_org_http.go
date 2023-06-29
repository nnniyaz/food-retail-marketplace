package management_org

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	service "github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	service service.ManagementOrgService
	logger  logger.Logger
}

func NewHttpDelivery(s service.ManagementOrgService, l logger.Logger) *HttpDelivery {
	return &HttpDelivery{service: s, logger: l}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Org struct {
	Id        string              `json:"id"`
	Logo      string              `json:"logo"`
	Name      string              `json:"name"`
	Currency  string              `json:"currency"`
	Phone     string              `json:"phone"`
	Email     string              `json:"email"`
	Address   string              `json:"address"`
	Desc      valueobject.OrgDesc `json:"desc"`
	CreatedAt time.Time           `json:"createdAt"`
	UpdatedAt time.Time           `json:"updatedAt"`
}

func NewOrg(u *organization.Organization) Org {
	return Org{
		Id:        u.GetId().String(),
		Logo:      u.GetLogo(),
		Name:      u.GetName().String(),
		Currency:  u.GetCurrency().String(),
		Phone:     u.GetContacts().GetPhone().String(),
		Email:     u.GetContacts().GetEmail().String(),
		Address:   u.GetContacts().GetAddress(),
		Desc:      u.GetDesc(),
		CreatedAt: u.GetCreatedAt(),
		UpdatedAt: u.GetUpdatedAt(),
	}
}

func NewOrgs(users []*organization.Organization) []Org {
	var us []Org
	for _, u := range users {
		us = append(us, NewOrg(u))
	}
	return us
}

func (hd *HttpDelivery) GetOrgsByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	orgs, err := hd.service.GetOrgsByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrgs(orgs))
}

func (hd *HttpDelivery) GetOrgById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "org_id")
	org, err := hd.service.GetOrgById(r.Context(), userId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrg(org))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type AddOrgIn struct {
	Logo     string         `json:"logo"`
	Name     string         `json:"name"`
	Currency string         `json:"currency"`
	Phone    string         `json:"phone"`
	Email    string         `json:"email"`
	Address  string         `json:"address"`
	Desc     *core.MlString `json:"desc"`
}

func (hd *HttpDelivery) AddOrg(w http.ResponseWriter, r *http.Request) {
	in := AddOrgIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	err := hd.service.AddOrg(r.Context(), in.Logo, in.Name, in.Currency, in.Phone, in.Email, in.Address, in.Desc)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateOrgInfoIn struct {
	Name     string         `json:"name"`
	Currency string         `json:"currency"`
	Phone    string         `json:"phone"`
	Email    string         `json:"email"`
	Address  string         `json:"address"`
	Desc     *core.MlString `json:"desc"`
}

func (hd *HttpDelivery) UpdateOrgInfo(w http.ResponseWriter, r *http.Request) {
	orgId := chi.URLParam(r, "org_id")
	in := UpdateOrgInfoIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	err := hd.service.UpdateOrgInfo(r.Context(), orgId, in.Name, in.Currency, in.Phone, in.Email, in.Address, in.Desc)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateOrgLogoIn struct {
	Logo string `json:"logo"`
}

func (hd *HttpDelivery) UpdateOrgLogo(w http.ResponseWriter, r *http.Request) {
	orgId := chi.URLParam(r, "org_id")
	in := UpdateOrgLogoIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	err := hd.service.UpdateOrgLogo(r.Context(), orgId, in.Logo)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteOrg(w http.ResponseWriter, r *http.Request) {
	orgId := chi.URLParam(r, "org_id")
	err := hd.service.DeleteOrg(r.Context(), orgId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
