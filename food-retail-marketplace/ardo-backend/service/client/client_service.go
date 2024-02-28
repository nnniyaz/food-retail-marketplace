package client

import (
	"context"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/format"
	"github/nnniyaz/ardo/pkg/logger"
	orderService "github/nnniyaz/ardo/service/order"
)

type ClientService interface {
	MakeOrder(ctx context.Context, user *user.User, userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, currency string, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment string) (OrderCreds, error)
}

type clientService struct {
	logger       logger.Logger
	orderService orderService.OrderService
	emailService email.Email
}

func NewClientService(l logger.Logger, orderService orderService.OrderService, emailService email.Email) ClientService {
	return &clientService{logger: l, orderService: orderService, emailService: emailService}
}

type OrderCreds struct {
	Number    string `json:"number"`
	CreatedAt string `json:"createdAt"`
}

func (c *clientService) MakeOrder(ctx context.Context, user *user.User, userId string, products []valueobject.OrderProduct, quantity int64, totalPrice float64, currency string, customerContacts valueobject.CustomerContacts, deliveryInfo valueobject.DeliveryInfo, orderComment string) (OrderCreds, error) {
	newOrder, err := order.NewOrder(userId, products, quantity, totalPrice, currency, customerContacts, deliveryInfo, orderComment)
	if err != nil {
		return OrderCreds{}, err
	}

	err = c.orderService.Create(ctx, newOrder)
	if err != nil {
		return OrderCreds{}, err
	}

	contacts := newOrder.GetCustomerContacts()
	subject := "Order number №" + newOrder.GetNumber().String()
	htmlBody := format.FormatOrderConfirmation(newOrder)
	err = c.emailService.SendMail([]string{contacts.GetEmail().String()}, subject, htmlBody)

	return OrderCreds{
		Number:    newOrder.GetNumber().String(),
		CreatedAt: newOrder.GetCreatedAt().String(),
	}, nil
}
