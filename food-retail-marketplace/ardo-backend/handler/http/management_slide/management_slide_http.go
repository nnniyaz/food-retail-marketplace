package management_slide

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/slide"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementSlideService
}

func NewHttpDelivery(l logger.Logger, service management.ManagementSlideService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Slide struct {
	Id        string        `json:"id"`
	Caption   core.MlString `json:"caption"`
	Img       string        `json:"img"`
	IsDeleted bool          `json:"isDeleted"`
	CreatedAt string        `json:"createdAt"`
	UpdatedAt string        `json:"updatedAt"`
	Version   int           `json:"version"`
}

func NewSlide(s *slide.Slide) *Slide {
	return &Slide{
		Id:        s.GetId().String(),
		Caption:   s.GetCaption(),
		Img:       s.GetImg(),
		IsDeleted: s.GetIsDeleted(),
		CreatedAt: s.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt: s.GetUpdatedAt().Format(time.RFC3339),
		Version:   s.GetVersion(),
	}
}

type SlidesData struct {
	Slides []*Slide `json:"slides"`
	Count  int64    `json:"count"`
}

func NewSlides(slides []*slide.Slide, count int64) *SlidesData {
	var ss []*Slide
	for _, s := range slides {
		ss = append(ss, NewSlide(s))
	}
	return &SlidesData{Slides: ss, Count: count}
}

// GetSlidesByFilters godoc
//
//	@Summary		Get slides by filters
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Slides
//	@Accept			json
//	@Produce		json
//	@Param			offset		query		int		false	"Offset"
//	@Param			limit		query		int		false	"Limit"
//	@Param			is_deleted	query		bool	false	"Is deleted"
//	@Success		200			{object}	response.Success{data=SlidesData}
//	@Failure		default		{object}	response.Error
//	@Router			/management/slides [get]
func (hd *HttpDelivery) GetSlidesByFilters(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	slides, count, err := hd.service.GetSlidesByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewSlides(slides, count))
}

// GetSlideById godoc
//
//	@Summary		Get slide by id
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Slides
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=Slide}
//	@Failure		default	{object}	response.Error
//	@Router			/management/slides/{slide_id} [get]
func (hd *HttpDelivery) GetSlideById(w http.ResponseWriter, r *http.Request) {
	slideId := chi.URLParam(r, "slide_id")
	s, err := hd.service.GetSlideById(r.Context(), slideId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewSlide(s))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateSlideIn struct {
	Caption core.MlString `json:"caption"`
	Img     string        `json:"img"`
}

// CreateSlide godoc
//
//	@Summary		Create slide
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Slides
//	@Accept			json
//	@Produce		json
//	@Param			data	body		CreateSlideIn	true	"Create slide object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/slides/{slide_id} [post]
func (hd *HttpDelivery) CreateSlide(w http.ResponseWriter, r *http.Request) {
	var in CreateSlideIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.CreateSlide(r.Context(), in.Caption, in.Img); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateSlideIn struct {
	Caption core.MlString `json:"caption"`
	Img     string        `json:"img"`
}

// UpdateSlide godoc
//
//	@Summary		Update slide
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Slides
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateSlideIn	true	"Update slide object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/slides/{slide_id} [put]
func (hd *HttpDelivery) UpdateSlide(w http.ResponseWriter, r *http.Request) {
	slideId := chi.URLParam(r, "slide_id")
	var in UpdateSlideIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateSlide(r.Context(), slideId, in.Caption, in.Img); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// RecoverSlide godoc
//
//	@Summary		Recover slide
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Slides
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/slides/recover/{slide_id} [put]
func (hd *HttpDelivery) RecoverSlide(w http.ResponseWriter, r *http.Request) {
	slideId := chi.URLParam(r, "slide_id")
	if err := hd.service.RecoverSlide(r.Context(), slideId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteSlide godoc
//
//	@Summary		Delete slide
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Slides
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/slides/{slide_id} [delete]
func (hd *HttpDelivery) DeleteSlide(w http.ResponseWriter, r *http.Request) {
	slideId := chi.URLParam(r, "slide_id")
	if err := hd.service.DeleteSlide(r.Context(), slideId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
