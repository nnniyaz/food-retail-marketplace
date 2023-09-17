package management_org

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/organization"
	"github/nnniyaz/ardo/domain/organization/valueobject"
	"github/nnniyaz/ardo/domain/user_organization"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	orgService management.ManagementOrgService
	logger     logger.Logger
}

func NewHttpDelivery(orgService management.ManagementOrgService, l logger.Logger) *HttpDelivery {
	return &HttpDelivery{orgService: orgService, logger: l}
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
	IsDeleted bool                `json:"isDeleted"`
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
		IsDeleted: u.GetIsDeleted(),
		CreatedAt: u.GetCreatedAt(),
		UpdatedAt: u.GetUpdatedAt(),
	}
}

func (hd *HttpDelivery) GetOrgById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "org_id")
	org, err := hd.orgService.GetOrgById(r.Context(), userId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrg(org))
}

type OrgsData struct {
	Orgs  []Org `json:"orgs"`
	Count int64 `json:"count"`
}

func NewOrgsData(users []*organization.Organization, count int64) OrgsData {
	var us []Org
	for _, u := range users {
		us = append(us, NewOrg(u))
	}
	return OrgsData{Orgs: us, Count: count}
}

func (hd *HttpDelivery) GetOrgsByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	orgs, count, err := hd.orgService.GetOrgsByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrgsData(orgs, count))
}

type OrgUser struct {
	Id        string    `json:"id"`
	OrgId     string    `json:"orgId"`
	UserId    string    `json:"userId"`
	Role      string    `json:"role"`
	IsDeleted bool      `json:"isDeleted"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewOrgUser(u *user_organization.UserOrganization) OrgUser {
	return OrgUser{
		Id:        u.GetId().String(),
		OrgId:     u.GetOrgId().String(),
		UserId:    u.GetUserId().String(),
		Role:      u.GetRole().String(),
		IsDeleted: u.GetIsDeleted(),
		CreatedAt: u.GetCreatedAt(),
		UpdatedAt: u.GetUpdatedAt(),
	}
}

type OrgUsersData struct {
	OrgUsers []OrgUser `json:"orgUsers"`
	Count    int64     `json:"count"`
}

func NewOrgUsersData(users []*user_organization.UserOrganization, count int64) OrgUsersData {
	var us []OrgUser
	for _, u := range users {
		us = append(us, NewOrgUser(u))
	}
	return OrgUsersData{OrgUsers: us, Count: count}
}

func (hd *HttpDelivery) GetUsersByOrgId(w http.ResponseWriter, r *http.Request) {
	orgId := chi.URLParam(r, "org_id")
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	users, count, err := hd.orgService.GetUsersByOrgId(r.Context(), orgId, offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrgUsersData(users, count))
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
	err := hd.orgService.AddOrg(r.Context(), in.Logo, in.Name, in.Currency, in.Phone, in.Email, in.Address, in.Desc)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type AddUserToOrgIn struct {
	UserId string `json:"userId"`
	Role   string `json:"role"`
}

func (hd *HttpDelivery) AddUserToOrg(w http.ResponseWriter, r *http.Request) {
	orgId := chi.URLParam(r, "org_id")
	in := AddUserToOrgIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	err := hd.orgService.AddUserToOrg(r.Context(), orgId, in.UserId, in.Role)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserInOrgIn struct {
	OrgId  string `json:"orgId"`
	UserId string `json:"userId"`
}

func (hd *HttpDelivery) RemoveUserFromOrg(w http.ResponseWriter, r *http.Request) {
	in := UpdateUserInOrgIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	err := hd.orgService.RemoveUserFromOrg(r.Context(), in.OrgId, in.UserId)
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
	err := hd.orgService.UpdateOrgInfo(r.Context(), orgId, in.Name, in.Currency, in.Phone, in.Email, in.Address, in.Desc)
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
	err := hd.orgService.UpdateOrgLogo(r.Context(), orgId, in.Logo)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteOrg(w http.ResponseWriter, r *http.Request) {
	orgId := chi.URLParam(r, "org_id")
	err := hd.orgService.DeleteOrg(r.Context(), orgId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
