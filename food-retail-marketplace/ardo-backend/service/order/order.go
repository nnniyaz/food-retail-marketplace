package order

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type OrderService interface {
	GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error)
	GetByUserId(ctx context.Context, offset, limit int64, isDeleted bool, userId string) ([]*order.Order, int64, error)
	GetOneById(ctx context.Context, orderId string) (*order.Order, error)
	Create(ctx context.Context, order *order.Order) error
	UpdateStatus(ctx context.Context, order *order.Order, status string) error
	Recover(ctx context.Context, orderId string) error
	Delete(ctx context.Context, orderId string) error
}

type orderService struct {
	orderRepo repo.Order
	logger    logger.Logger
}

func NewOrderService(repo repo.Order, l logger.Logger) OrderService {
	return &orderService{orderRepo: repo, logger: l}
}

func (o *orderService) GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return o.orderRepo.FindByFilters(ctx, offset, limit, isDeleted)
}

func (o *orderService) GetByUserId(ctx context.Context, offset, limit int64, isDeleted bool, userId string) ([]*order.Order, int64, error) {
	convertedId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, 0, err
	}
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return o.orderRepo.FindUserOrdersByFilters(ctx, offset, limit, isDeleted, convertedId)
}

func (o *orderService) GetOneById(ctx context.Context, orderId string) (*order.Order, error) {
	convertedId, err := uuid.UUIDFromString(orderId)
	if err != nil {
		return nil, err
	}
	return o.orderRepo.FindOneById(ctx, convertedId)
}

func (o *orderService) Create(ctx context.Context, newOrder *order.Order) error {
	return o.orderRepo.Create(ctx, newOrder)
}

func (o *orderService) UpdateStatus(ctx context.Context, order *order.Order, status string) error {
	if err := order.UpdateStatus(status); err != nil {
		return err
	}
	return o.orderRepo.Update(ctx, order)
}

func (o *orderService) Recover(ctx context.Context, id string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	return o.orderRepo.Recover(ctx, convertedId)
}

func (o *orderService) Delete(ctx context.Context, id string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	return o.orderRepo.Delete(ctx, convertedId)
}
