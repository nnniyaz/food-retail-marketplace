package upload

import (
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/upload"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service upload.UploadService
}

func NewHttpDelivery(l logger.Logger, s upload.UploadService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: s}
}

// UploadSlidesImage godoc
//
//	@Summary		Uploads a slide image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/slide-image [post]
func (hd *HttpDelivery) UploadSlidesImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage("slides", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadSectionImage godoc
//
//	@Summary		Uploads a section image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/section-image [post]
func (hd *HttpDelivery) UploadSectionImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage("sections", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadCategoriesImage godoc
//
//	@Summary		Uploads a category image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/category-image [post]
func (hd *HttpDelivery) UploadCategoriesImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20) // 5 MB
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage("categories", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadProductImage godoc
//
//	@Summary		Uploads a product image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/product-image [post]
func (hd *HttpDelivery) UploadProductImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage("products", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}
