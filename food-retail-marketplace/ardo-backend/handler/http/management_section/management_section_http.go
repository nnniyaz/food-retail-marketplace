package management_section

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/section"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementSectionService
}

func NewHttpDelivery(l logger.Logger, service management.ManagementSectionService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Section struct {
	Id        string        `json:"id"`
	Name      core.MlString `json:"name"`
	Img       string        `json:"img"`
	IsDeleted bool          `json:"isDeleted"`
	CreatedAt time.Time     `json:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt"`
	Version   int           `json:"version"`
}

func NewSection(s *section.Section) *Section {
	return &Section{
		Id:        s.GetId().String(),
		Name:      s.GetName(),
		Img:       s.GetImg(),
		IsDeleted: s.GetIsDeleted(),
		CreatedAt: s.GetCreatedAt(),
		UpdatedAt: s.GetUpdatedAt(),
		Version:   s.GetVersion(),
	}
}

type SectionsData struct {
	Sections []*Section `json:"sections"`
	Count    int64      `json:"count"`
}

func NewSections(sections []*section.Section, count int64) *SectionsData {
	var ss []*Section
	for _, s := range sections {
		ss = append(ss, NewSection(s))
	}
	return &SectionsData{Sections: ss, Count: count}
}

func (hd *HttpDelivery) GetSectionsByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	sections, count, err := hd.service.GetSectionsByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewSections(sections, count))
}

func (hd *HttpDelivery) GetSectionById(w http.ResponseWriter, r *http.Request) {
	sectionId := chi.URLParam(r, "section_id")
	s, err := hd.service.GetSectionById(r.Context(), sectionId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewSection(s))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateSectionIn struct {
	Name core.MlString `json:"name"`
	Img  string        `json:"img"`
}

func (hd *HttpDelivery) CreateSection(w http.ResponseWriter, r *http.Request) {
	var in CreateSectionIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.CreateSection(r.Context(), in.Name, in.Img); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateSectionIn struct {
	Name core.MlString `json:"name"`
	Img  string        `json:"img"`
}

func (hd *HttpDelivery) UpdateSection(w http.ResponseWriter, r *http.Request) {
	sectionId := chi.URLParam(r, "section_id")
	var in UpdateSectionIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateSection(r.Context(), sectionId, in.Name, in.Img); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) RecoverSection(w http.ResponseWriter, r *http.Request) {
	sectionId := chi.URLParam(r, "section_id")
	if err := hd.service.RecoverSection(r.Context(), sectionId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteSection(w http.ResponseWriter, r *http.Request) {
	sectionId := chi.URLParam(r, "section_id")
	if err := hd.service.DeleteSection(r.Context(), sectionId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
