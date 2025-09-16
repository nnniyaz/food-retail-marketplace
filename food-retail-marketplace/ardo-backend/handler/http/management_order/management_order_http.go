package management_order

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service management.ManagementOrderService
}

func NewHttpDelivery(l logger.Logger, service management.ManagementOrderService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
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

// GetOrdersByFilters godoc
//
//	@Summary		Get orders by filters
//	@Description	This can only be done by the logged-in user.
//	@Tags			Client
//	@Accept			json
//	@Produce		json
//	@Param			offset		query		int		false	"Offset"
//	@Param			limit		query		int		false	"Limit"
//	@Param			is_deleted	query		bool	false	"Is deleted"
//	@Success		200			{object}	response.Success{data=OrdersData}
//	@Failure		default		{object}	response.Error
//	@Router			/client/orders/{order_id} [get]
func (hd *HttpDelivery) GetOrdersByFilters(w http.ResponseWriter, r *http.Request) {
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

// GetByUserId godoc
//
//	@Summary		Get orders by user id
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=OrdersData}
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders/user/{user_id} [get]
func (hd *HttpDelivery) GetByUserId(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	isDeleted := r.Context().Value("is_deleted").(bool)
	userId := chi.URLParam(r, "user_id")
	orders, count, err := hd.service.GetByUserId(r.Context(), offset, limit, isDeleted, userId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrders(orders, count))
}

// GetOneById godoc
//
//	@Summary		Get order by id
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success{data=Order}
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders/{order_id} [get]
func (hd *HttpDelivery) GetOneById(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	o, err := hd.service.GetOneById(r.Context(), orderId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewOrder(o))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateOrderIn struct {
	UserId   string `json:"userId"`
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

// CreateOrder godoc
//
//	@Summary		Create order
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Param			data	body		CreateOrderIn	true	"Create order object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders [post]
func (hd *HttpDelivery) CreateOrder(w http.ResponseWriter, r *http.Request) {
	in := CreateOrderIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

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

	if err := hd.service.Create(r.Context(), in.UserId, orderProducts, in.Quantity, in.TotalPrice, in.Currency, customerContacts, orderDeliveryInfo); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateOrderStatusIn struct {
	Status string `json:"status"`
}

// UpdateOrderStatus godoc
//
//	@Summary		Update order status
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Param			data	body		UpdateOrderStatusIn	true	"Update order status object"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders/status/{order_id} [put]
func (hd *HttpDelivery) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	in := UpdateOrderStatusIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateStatus(r.Context(), orderId, in.Status); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// RecoverOrder godoc
//
//	@Summary		Recover order
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders/recover/{order_id} [put]
func (hd *HttpDelivery) RecoverOrder(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	if err := hd.service.Recover(r.Context(), orderId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteOrder godoc
//
//	@Summary		Delete order
//	@Description	This can only be done by the logged-in user.
//	@Tags			Management Orders
//	@Accept			json
//	@Produce		json
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/management/orders/{order_id} [delete]
func (hd *HttpDelivery) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	if err := hd.service.Delete(r.Context(), orderId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
