package management_order

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/handler/http/response"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service/management"
	"net/http"
)

type HttpDelivery struct {
	service management.ManagementOrderService
	logger  logger.Logger
}

func NewHttpDelivery(service management.ManagementOrderService, l logger.Logger) *HttpDelivery {
	return &HttpDelivery{service: service, logger: l}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type OrderProduct struct {
	ProductId   string        `json:"productId"`
	ProductName core.MlString `json:"productName"`
	Quantity    int           `json:"quantity"`
	TotalPrice  float64       `json:"totalPrice"`
}

func NewOrderProduct(o valueobject.OrderProduct) OrderProduct {
	return OrderProduct{
		ProductId:   o.GetProductId().String(),
		ProductName: o.GetProductName(),
		Quantity:    o.GetQuantity(),
		TotalPrice:  o.GetTotalPrice(),
	}
}

func NewOrderProducts(o []valueobject.OrderProduct) []OrderProduct {
	var ord []OrderProduct
	for _, p := range o {
		ord = append(ord, NewOrderProduct(p))
	}
	return ord
}

func UnmarshalOrderProductsFromRequest(orderProducts []OrderProduct) []valueobject.OrderProduct {
	var ops []valueobject.OrderProduct
	for _, p := range orderProducts {
		ops = append(ops, valueobject.NewOrderProduct(p.ProductId, p.ProductName, p.Quantity, p.TotalPrice))
	}
	return ops
}

type OrderCustomerContacts struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

func NewOrderCustomerContacts(o valueobject.CustomerContacts) OrderCustomerContacts {
	return OrderCustomerContacts{
		Name:  o.GetName(),
		Phone: o.GetPhone(),
		Email: o.GetEmail().String(),
	}
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

func NewOrderDeliveryInfo(o valueobject.DeliveryInfo) OrderDeliveryInfo {
	return OrderDeliveryInfo{
		Address:         o.GetAddress(),
		Floor:           o.GetFloor(),
		Apartment:       o.GetApartment(),
		DeliveryComment: o.GetDeliveryComment(),
	}
}

func UnmarshalOrderDeliveryInfoFromRequest(o OrderDeliveryInfo) valueobject.DeliveryInfo {
	return valueobject.NewDeliveryInfo(o.Address, o.Floor, o.Apartment, o.DeliveryComment)
}

type Order struct {
	Id               string                `json:"id"`
	UserId           string                `json:"userId"`
	Products         []OrderProduct        `json:"products"`
	Quantity         int                   `json:"quantity"`
	TotalPrice       float64               `json:"totalPrice"`
	CustomerContacts OrderCustomerContacts `json:"customerContacts"`
	DeliveryInfo     OrderDeliveryInfo     `json:"deliveryInfo"`
	OrderComment     string                `json:"orderComment"`
	IsDeleted        bool                  `json:"isDeleted"`
	Status           string                `json:"status"`
	CreatedAt        string                `json:"createdAt"`
	UpdatedAt        string                `json:"updatedAt"`
}

func NewOrder(o *order.Order) Order {
	return Order{
		Id:               o.GetId().String(),
		UserId:           o.GetUserId().String(),
		Products:         NewOrderProducts(o.GetProducts()),
		Quantity:         o.GetQuantity(),
		TotalPrice:       o.GetTotalPrice(),
		CustomerContacts: NewOrderCustomerContacts(o.GetCustomerContacts()),
		DeliveryInfo:     NewOrderDeliveryInfo(o.GetDeliveryInfo()),
		OrderComment:     o.GetOrderComment(),
		IsDeleted:        o.GetIsDeleted(),
		Status:           o.GetStatus().String(),
		CreatedAt:        o.GetCreatedAt().String(),
		UpdatedAt:        o.GetUpdatedAt().String(),
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

func (hd *HttpDelivery) GetAllByFilters(w http.ResponseWriter, r *http.Request) {
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

type CreateOrderRequest struct {
	UserId           string                `json:"userId"`
	Products         []OrderProduct        `json:"products"`
	Quantity         int                   `json:"quantity"`
	TotalPrice       float64               `json:"totalPrice"`
	CustomerContacts OrderCustomerContacts `json:"customerContacts"`
	DeliveryInfo     OrderDeliveryInfo     `json:"deliveryInfo"`
	OrderComment     string                `json:"orderComment"`
}

func (hd *HttpDelivery) CreateOrder(w http.ResponseWriter, r *http.Request) {
	in := CreateOrderRequest{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.UserId, UnmarshalOrderProductsFromRequest(in.Products), in.Quantity, in.TotalPrice, UnmarshalOrderCustomerContactsFromRequest(in.CustomerContacts), UnmarshalOrderDeliveryInfoFromRequest(in.DeliveryInfo), in.OrderComment); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status"`
}

func (hd *HttpDelivery) UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	in := UpdateOrderStatusRequest{}
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

func (hd *HttpDelivery) RecoverOrder(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	if err := hd.service.Recover(r.Context(), orderId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "order_id")
	if err := hd.service.Delete(r.Context(), orderId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
