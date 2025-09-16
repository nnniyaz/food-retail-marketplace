package management

import (
	"context"
	"github/nnniyaz/ardo/domain/orderSettings"
	"github/nnniyaz/ardo/pkg/logger"
	orderSettingsService "github/nnniyaz/ardo/service/orderSettings"
)

type ManagementOrderSettingsService interface {
	GetOrderSettings(ctx context.Context) (*orderSettings.OrderSettings, error)
	UpdateMoqFee(ctx context.Context, fee, freeFrom int64) error
}

type managementOrderSettingsService struct {
	logger  logger.Logger
	service orderSettingsService.OrderSettingsService
}

func NewManagementOrderSettingsService(l logger.Logger, orderSettingsService orderSettingsService.OrderSettingsService) ManagementOrderSettingsService {
	return &managementOrderSettingsService{logger: l, service: orderSettingsService}
}

func (m *managementOrderSettingsService) GetOrderSettings(ctx context.Context) (*orderSettings.OrderSettings, error) {
	return m.service.GetOrderSettings(ctx)
}

func (m *managementOrderSettingsService) UpdateMoqFee(ctx context.Context, fee, freeFrom int64) error {
	return m.service.UpdateMoqFee(ctx, fee, freeFrom)
}
