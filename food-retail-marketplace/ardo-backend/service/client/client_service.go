package client

import (
	"context"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/format"
	"github/nnniyaz/ardo/pkg/logger"
	orderService "github/nnniyaz/ardo/service/order"
	userService "github/nnniyaz/ardo/service/user"
	"strings"
)

type ClientService interface {
	GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error)
	MakeOrder(ctx context.Context, user *user.User, userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, currency string, customerContacts valueobject.CustomerContacts, deliveryInfo deliveryInfo.DeliveryInfo) (struct{ OrderNumber string }, error)
}

type clientService struct {
	logger       logger.Logger
	orderService orderService.OrderService
	emailService email.Email
	userService  userService.UserService
}

func NewClientService(l logger.Logger, orderService orderService.OrderService, emailService email.Email, userService userService.UserService) ClientService {
	return &clientService{logger: l, orderService: orderService, emailService: emailService, userService: userService}
}

func (c *clientService) GetAllByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error) {
	return c.orderService.GetAllByFilters(ctx, offset, limit, isDeleted)
}

func (c *clientService) MakeOrder(ctx context.Context, user *user.User, userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, currency string, customerContacts valueobject.CustomerContacts, deliveryInfo deliveryInfo.DeliveryInfo) (struct{ OrderNumber string }, error) {
	newOrder, err := order.NewOrder(userId, products, quantity, totalPrice, currency, customerContacts, deliveryInfo)
	if err != nil {
		return struct{ OrderNumber string }{OrderNumber: ""}, err
	}

	err = c.orderService.Create(ctx, newOrder)
	if err != nil {
		return struct{ OrderNumber string }{OrderNumber: ""}, err
	}

	userLastDeliveryPoint := user.GetLastDeliveryPoint()
	go c.userService.UpdateDeliveryPoint(ctx, user, userLastDeliveryPoint.GetId().String(), deliveryInfo.GetAddress(), deliveryInfo.GetFloor(), deliveryInfo.GetApartment(), strings.Split(deliveryInfo.GetDeliveryComment(), "Delivery date:")[0])

	contacts := newOrder.GetCustomerContacts()
	subject := core.Txts[core.TXT_ORDER_NUMBER].GetByLangOrEmpty(ctx.Value("userLang").(core.Lang)) + " #" + newOrder.GetNumber().String()
	htmlBody := format.FormatOrderConfirmation(newOrder, ctx.Value("userLang").(core.Lang))
	go c.emailService.SendMail([]string{contacts.GetEmail().String()}, subject, htmlBody)

	return struct{ OrderNumber string }{OrderNumber: newOrder.GetNumber().String()}, nil
}
