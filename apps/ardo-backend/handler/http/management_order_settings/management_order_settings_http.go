package management_order_settings

import (
	"encoding/json"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementOrderSettingsService
}

func NewHttpDelivery(l logger.Logger, s management.ManagementOrderSettingsService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: s}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type OrderSettings struct {
	Moq struct {
		Fee      int64 `json:"fee"`
		FreeFrom int64 `json:"freeFrom"`
	} `json:"moq"`
}

// GetOrderSettings godoc
//
//	@Summary		Get order settings
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Order Settings
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=OrderSettings}
//	@Failure		default	{object}	response.Error
//	@Router			/management/order-settings [get]
func (hd *HttpDelivery) GetOrderSettings(w http.ResponseWriter, r *http.Request) {
	orderSettings, err := hd.service.GetOrderSettings(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	moq := orderSettings.GetMoq()
	response.NewSuccess(hd.logger, w, r, OrderSettings{Moq: struct {
		Fee      int64 `json:"fee"`
		FreeFrom int64 `json:"freeFrom"`
	}{
		Fee:      moq.GetFee(),
		FreeFrom: moq.GetFreeFrom(),
	}})
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type UpdateOrderSettingsMoqIn struct {
	Fee      int64 `json:"fee"`
	FreeFrom int64 `json:"freeFrom"`
}

// UpdateMoqFee godoc
//
//	@Summary		Update order settings MOQ
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Order Settings
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateOrderSettingsMoqIn	true	"MOQ"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders [post]
func (hd *HttpDelivery) UpdateMoqFee(w http.ResponseWriter, r *http.Request) {
	in := UpdateOrderSettingsMoqIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateMoqFee(r.Context(), in.Fee, in.FreeFrom); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
