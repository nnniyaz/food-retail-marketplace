package client

import (
	"encoding/json"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/client"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service client.ClientService
}

func NewHttpDelivery(l logger.Logger, c client.ClientService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: c}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type MakeOrderIn struct {
	Products []struct {
		ProductId    string        `json:"productId"`
		ProductName  core.MlString `json:"productName"`
		Quantity     int64         `json:"quantity"`
		PricePerUnit float64       `json:"pricePerUnit"`
		TotalPrice   float64       `json:"totalPrice"`
	} `json:"products"`
	Quantity         int64   `json:"quantity"`
	TotalPrice       float64 `json:"totalPrice"`
	Currency         string  `json:"currency"`
	CustomerContacts struct {
		Name  string `json:"name"`
		Phone struct {
			Number      string `json:"number"`
			CountryCode string `json:"countryCode"`
		} `json:"phone"`
		Email string `json:"email"`
	} `json:"customerContacts"`
	DeliveryInfo struct {
		Address         string `json:"address"`
		Floor           string `json:"floor"`
		Apartment       string `json:"apartment"`
		DeliveryComment string `json:"deliveryComment"`
	} `json:"deliveryInfo"`
}

type MakeOrderOut struct {
	OrderNumber string `json:"orderNumber"`
}

// MakeOrder godoc
//
//	@Summary		Make order
//	@Description	This can only be done by the logged-in user.
//	@Tags			Client
//	@Accept			json
//	@Produce		json
//	@Param			data	body		MakeOrderIn	true	"Make order object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/client/make-order [post]
func (hd *HttpDelivery) MakeOrder(w http.ResponseWriter, r *http.Request) {
	var in MakeOrderIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}
	u := r.Context().Value("user").(user.User)

	orderProducts := make([]valueobject.OrderProduct, 0, len(in.Products))
	for _, p := range in.Products {
		orderProduct, err := valueobject.NewOrderProduct(p.ProductId, p.ProductName, p.Quantity, p.PricePerUnit, p.TotalPrice)
		if err != nil {
			response.NewError(hd.logger, w, r, err)
			return
		}
		orderProducts = append(orderProducts, orderProduct)
	}

	customerContacts, err := valueobject.NewCustomerContacts(in.CustomerContacts.Name, in.CustomerContacts.Phone.Number, in.CustomerContacts.Phone.CountryCode, in.CustomerContacts.Email)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	orderDeliveryInfo, err := deliveryInfo.NewDeliveryInfo(in.DeliveryInfo.Address, in.DeliveryInfo.Floor, in.DeliveryInfo.Apartment, in.DeliveryInfo.DeliveryComment)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	orderCreds, err := hd.service.MakeOrder(r.Context(), &u, u.GetId().String(), orderProducts, in.Quantity, in.TotalPrice, in.Currency, customerContacts, orderDeliveryInfo)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, orderCreds)
}
