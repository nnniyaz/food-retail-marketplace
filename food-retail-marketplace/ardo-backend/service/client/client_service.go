package client

import (
	"context"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/format"
	"github/nnniyaz/ardo/pkg/logger"
	orderService "github/nnniyaz/ardo/service/order"
	userService "github/nnniyaz/ardo/service/user"
)

type ClientService interface {
	MakeOrder(ctx context.Context, user *user.User, userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, currency string, customerContacts valueobject.CustomerContacts, deliveryInfo deliveryInfo.DeliveryInfo, deliveryPointId string) (struct{ OrderNumber string }, error)
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

func (c *clientService) MakeOrder(ctx context.Context, user *user.User, userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, currency string, customerContacts valueobject.CustomerContacts, deliveryInfo deliveryInfo.DeliveryInfo, deliveryPointId string) (struct{ OrderNumber string }, error) {
	newOrder, err := order.NewOrder(userId, products, quantity, totalPrice, currency, customerContacts, deliveryInfo)
	if err != nil {
		return struct{ OrderNumber string }{OrderNumber: ""}, err
	}

	err = c.orderService.Create(ctx, newOrder)
	if err != nil {
		return struct{ OrderNumber string }{OrderNumber: ""}, err
	}

	_, err = uuid.UUIDFromString(deliveryPointId)
	if err != nil {
		_ = c.userService.AddDeliveryPoint(ctx, user, deliveryInfo)
	} else {
		_ = c.userService.ChangeLastDeliveryPoint(ctx, user, deliveryPointId)
	}

	contacts := newOrder.GetCustomerContacts()
	subject := core.Txts[core.TXT_ORDER_NUMBER].GetByLangOrEmpty(ctx.Value("userLang").(core.Lang)) + " #" + newOrder.GetNumber().String()
	htmlBody := format.FormatOrderConfirmation(newOrder, ctx.Value("userLang").(core.Lang))
	err = c.emailService.SendMail([]string{contacts.GetEmail().String()}, subject, htmlBody)

	return struct{ OrderNumber string }{OrderNumber: newOrder.GetNumber().String()}, nil
}
