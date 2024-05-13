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

func (hd *HttpDelivery) UploadSlidesImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(1 << 20)
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

func (hd *HttpDelivery) UploadSectionImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(1 << 20)
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

func (hd *HttpDelivery) UploadCategoriesImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(1 << 20)
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

func (hd *HttpDelivery) UploadProductImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(1 << 20)
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
