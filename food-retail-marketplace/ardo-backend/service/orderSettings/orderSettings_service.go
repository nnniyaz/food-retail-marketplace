package orderSettings

import (
	"context"
	"github/nnniyaz/ardo/domain/orderSettings"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type OrderSettingsService interface {
	GetOrderSettings(ctx context.Context) (*orderSettings.OrderSettings, error)
	UpdateMoqFee(ctx context.Context, fee, freeFrom int64) error
}

type orderSettingsService struct {
	logger            logger.Logger
	orderSettingsRepo repo.OrderSettings
}

func NewOrderSettingsService(l logger.Logger, orderSettingsRepo repo.OrderSettings) OrderSettingsService {
	return &orderSettingsService{logger: l, orderSettingsRepo: orderSettingsRepo}
}

func (m *orderSettingsService) GetOrderSettings(ctx context.Context) (*orderSettings.OrderSettings, error) {
	return m.orderSettingsRepo.GetOrderSettings(ctx)
}

func (m *orderSettingsService) UpdateMoqFee(ctx context.Context, fee, freeFrom int64) error {
	foundOrderSettings, err := m.orderSettingsRepo.GetOrderSettings(ctx)
	if err != nil {
		return err
	}
	foundOrderSettings.UpdateMoq(fee, freeFrom)
	return m.orderSettingsRepo.UpdateMoqFee(ctx, foundOrderSettings)
}
