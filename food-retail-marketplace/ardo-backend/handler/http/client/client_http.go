package client

import (
	"encoding/json"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/order"
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
// Queries
// -----------------------------------------------------------------------------

type Order struct {
	Id       string `json:"id"`
	UserId   string `json:"userId"`
	Number   string `json:"number"`
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
	StatusHistory []struct {
		Status    string `json:"status"`
		UpdatedAt string `json:"updatedAt"`
	} `json:"statusHistory"`
	IsDeleted bool   `json:"isDeleted"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	Version   int    `json:"version"`
}

func NewOrder(o *order.Order) Order {
	orderProducts := make([]struct {
		ProductId    string        `json:"productId"`
		ProductName  core.MlString `json:"productName"`
		Quantity     int64         `json:"quantity"`
		PricePerUnit float64       `json:"pricePerUnit"`
		TotalPrice   float64       `json:"totalPrice"`
	}, len(o.GetProducts()))
	for i, p := range o.GetProducts() {
		orderProducts[i] = struct {
			ProductId    string        `json:"productId"`
			ProductName  core.MlString `json:"productName"`
			Quantity     int64         `json:"quantity"`
			PricePerUnit float64       `json:"pricePerUnit"`
			TotalPrice   float64       `json:"totalPrice"`
		}{
			ProductId:    p.GetProductId().String(),
			ProductName:  p.GetProductName(),
			Quantity:     p.GetQuantity(),
			PricePerUnit: p.GetPricePerUnit(),
			TotalPrice:   p.GetTotalPrice(),
		}
	}
	orderCustomerContacts := o.GetCustomerContacts()
	orderCustomerContactsPhone := orderCustomerContacts.GetPhone()
	orderCustomerContactsEmail := orderCustomerContacts.GetEmail()
	orderDeliveryInfo := o.GetDeliveryInfo()

	orderStatusHistory := make([]struct {
		Status    string `json:"status"`
		UpdatedAt string `json:"updatedAt"`
	}, len(o.GetStatusHistory()))
	for i, s := range o.GetStatusHistory() {
		orderStatusHistory[i] = struct {
			Status    string `json:"status"`
			UpdatedAt string `json:"updatedAt"`
		}{
			Status:    s.GetStatus().String(),
			UpdatedAt: s.GetUpdatedAt().Format(time.RFC3339),
		}
	}

	return Order{
		Id:         o.GetId().String(),
		UserId:     o.GetUserId().String(),
		Number:     o.GetNumber().String(),
		Products:   orderProducts,
		Quantity:   o.GetQuantity(),
		TotalPrice: o.GetTotalPrice(),
		Currency:   o.GetCurrency().String(),
		CustomerContacts: struct {
			Name  string `json:"name"`
			Phone struct {
				Number      string `json:"number"`
				CountryCode string `json:"countryCode"`
			} `json:"phone"`
			Email string `json:"email"`
		}{
			Name: orderCustomerContacts.GetName(),
			Phone: struct {
				Number      string `json:"number"`
				CountryCode string `json:"countryCode"`
			}{
				Number:      orderCustomerContactsPhone.GetNumber(),
				CountryCode: orderCustomerContactsPhone.GetCountryCode(),
			},
			Email: orderCustomerContactsEmail.String(),
		},
		DeliveryInfo: struct {
			Address         string `json:"address"`
			Floor           string `json:"floor"`
			Apartment       string `json:"apartment"`
			DeliveryComment string `json:"deliveryComment"`
		}{
			Address:         orderDeliveryInfo.GetAddress(),
			Floor:           orderDeliveryInfo.GetFloor(),
			Apartment:       orderDeliveryInfo.GetApartment(),
			DeliveryComment: orderDeliveryInfo.GetDeliveryComment(),
		},
		StatusHistory: orderStatusHistory,
		IsDeleted:     o.GetIsDeleted(),
		CreatedAt:     o.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt:     o.GetUpdatedAt().Format(time.RFC3339),
		Version:       o.GetVersion(),
	}
}

type OrdersData struct {
	Orders []Order `json:"orders"`
	Count  int64   `json:"count"`
}

func NewOrders(orders []*order.Order, count int64) OrdersData {
	var ord []Order
	for _, o := range orders {
		ord = append(ord, NewOrder(o))
	}
	return OrdersData{Orders: ord, Count: count}
}

// GetOrdersHistory godoc
//
//	@Summary		Get orders history
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Param			offset		query		int		false	"Offset"
//	@Param			limit		query		int		false	"Limit"
//	@Param			is_deleted	query		bool	false	"Is deleted"
//	@Success		200			{object}	response.Success{data=OrdersData}
//	@Failure		default		{object}	response.Error
//	@Router			/management/orders/{order_id} [get]
func (hd *HttpDelivery) GetOrdersHistory(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	orders, count, err := hd.service.GetAllByFilters(r.Context(), offset, limit, isDeleted)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrders(orders, count))
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
		DeliveryPointId string `json:"deliveryPointId"`
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
