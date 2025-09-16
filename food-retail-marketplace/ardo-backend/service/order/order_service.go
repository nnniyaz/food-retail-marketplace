package order

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/exceptions"
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
	logger    logger.Logger
	orderRepo repo.Order
}

func NewOrderService(l logger.Logger, repo repo.Order) OrderService {
	return &orderService{logger: l, orderRepo: repo}
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

func (o *orderService) Recover(ctx context.Context, orderId string) error {
	foundOrder, err := o.GetOneById(ctx, orderId)
	if err != nil {
		return err
	}
	if !foundOrder.GetIsDeleted() {
		return exceptions.ErrOrderAlreadyExist
	}
	return o.orderRepo.Recover(ctx, foundOrder.GetId())
}

func (o *orderService) Delete(ctx context.Context, orderId string) error {
	foundOrder, err := o.GetOneById(ctx, orderId)
	if err != nil {
		return err
	}
	if foundOrder.GetIsDeleted() {
		return exceptions.ErrOrderNotFound
	}
	return o.orderRepo.Delete(ctx, foundOrder.GetId())
}
