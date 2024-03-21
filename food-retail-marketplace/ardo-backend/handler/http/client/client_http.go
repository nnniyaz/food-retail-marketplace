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
	"time"
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

type OrderProduct struct {
	ProductId    string        `json:"productId"`
	ProductName  core.MlString `json:"productName"`
	Quantity     int64         `json:"quantity"`
	PricePerUnit float64       `json:"pricePerUnit"`
	TotalPrice   float64       `json:"totalPrice"`
}

func UnmarshalOrderProductsFromRequest(orderProducts []OrderProduct) []valueobject.OrderProduct {
	var ops []valueobject.OrderProduct
	for _, p := range orderProducts {
		ops = append(ops, valueobject.NewOrderProduct(p.ProductId, p.ProductName, p.Quantity, p.PricePerUnit, p.TotalPrice))
	}
	return ops
}

type OrderCustomerContacts struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

func UnmarshalOrderCustomerContactsFromRequest(o OrderCustomerContacts) valueobject.CustomerContacts {
	return valueobject.NewCustomerContacts(o.Name, o.Phone, o.Email)
}

type OrderDeliveryInfo struct {
	Address         string `json:"address"`
	Floor           string `json:"floor"`
	Apartment       string `json:"apartment"`
	DeliveryComment string `json:"deliveryComment"`
}

func UnmarshalOrderDeliveryInfoFromRequest(o OrderDeliveryInfo) deliveryInfo.DeliveryInfo {
	return deliveryInfo.NewDeliveryInfo(o.Address, o.Floor, o.Apartment, o.DeliveryComment)
}

type MakeOrderIn struct {
	Products         []OrderProduct        `json:"products"`
	Quantity         int64                 `json:"quantity"`
	TotalPrice       float64               `json:"totalPrice"`
	Currency         string                `json:"currency"`
	CustomerContacts OrderCustomerContacts `json:"customerContacts"`
	DeliveryInfo     OrderDeliveryInfo     `json:"deliveryInfo"`
	DeliveryDate     time.Time             `json:"deliveryDate"`
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
	orderCreds, err := hd.service.MakeOrder(r.Context(), u.GetId().String(), UnmarshalOrderProductsFromRequest(in.Products), in.Quantity, in.TotalPrice, in.Currency, UnmarshalOrderCustomerContactsFromRequest(in.CustomerContacts), UnmarshalOrderDeliveryInfoFromRequest(in.DeliveryInfo), in.DeliveryDate)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, orderCreds)
}
