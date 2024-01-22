package management

import (
	"context"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/pkg/logger"
	orderService "github/nnniyaz/ardo/service/order"
)

type ManagementOrderService interface {
	GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error)
	GetByUserId(ctx context.Context, offset, limit int64, isDeleted bool, userId string) ([]*order.Order, int64, error)
	GetOneById(ctx context.Context, userId string) (*order.Order, error)
	Create(ctx context.Context, userId string, products []valueobject.OrderProduct, quantity int, totalPrice float64, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment string) error
	UpdateStatus(ctx context.Context, userId string, status string) error
	Recover(ctx context.Context, userId string) error
	Delete(ctx context.Context, userId string) error
}

type managementOrderService struct {
	orderService orderService.OrderService
	logger       logger.Logger
}

func NewManagementOrderService(orderService orderService.OrderService, l logger.Logger) ManagementOrderService {
	return &managementOrderService{orderService: orderService, logger: l}
}

func (m *managementOrderService) GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error) {
	return m.orderService.GetAllByFilters(ctx, offset, limit, isDeleted)
}

func (m *managementOrderService) GetByUserId(ctx context.Context, offset, limit int64, isDeleted bool, userId string) ([]*order.Order, int64, error) {
	return m.orderService.GetByUserId(ctx, offset, limit, isDeleted, userId)
}

func (m *managementOrderService) GetOneById(ctx context.Context, orderId string) (*order.Order, error) {
	return m.orderService.GetOneById(ctx, orderId)
}

func (m *managementOrderService) Create(ctx context.Context, userId string, products []valueobject.OrderProduct, quantity int, totalPrice float64, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment string) error {
	newOrder, err := order.NewOrder(userId, products, quantity, totalPrice, customerContacts, deliveryInfo, orderComment)
	if err != nil {
		return err
	}
	return m.orderService.Create(ctx, newOrder)
}

func (m *managementOrderService) UpdateStatus(ctx context.Context, orderId string, status string) error {
	foundOrder, err := m.orderService.GetOneById(ctx, orderId)
	if err != nil {
		return err
	}
	return m.orderService.UpdateStatus(ctx, foundOrder, status)
}

func (m *managementOrderService) Recover(ctx context.Context, orderId string) error {
	return m.orderService.Recover(ctx, orderId)
}

func (m *managementOrderService) Delete(ctx context.Context, orderId string) error {
	return m.orderService.Delete(ctx, orderId)
}
