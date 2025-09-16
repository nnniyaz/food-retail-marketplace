package order

import (
	"context"
	"errors"
	"github/nnniyaz/ardo/domain/base/deliveryInfo"
	"github/nnniyaz/ardo/domain/base/phone"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/order"
	"github/nnniyaz/ardo/domain/order/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoOrder struct {
	client *mongo.Client
}

func NewRepoOrder(client *mongo.Client) *RepoOrder {
	return &RepoOrder{client: client}
}

func (r *RepoOrder) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("orders")
}

type mongoOrder struct {
	Id       uuid.UUID `bson:"_id"`
	UserId   uuid.UUID `bson:"userId"`
	Number   string    `bson:"number"`
	Products []struct {
		ProductId    uuid.UUID     `bson:"productId"`
		ProductName  core.MlString `bson:"productName"`
		Quantity     int64         `bson:"quantity"`
		PricePerUnit float64       `bson:"pricePerUnit"`
		TotalPrice   float64       `bson:"totalPrice"`
	} `bson:"products"`
	Quantity         int64   `bson:"quantity"`
	TotalPrice       float64 `bson:"totalPrice"`
	Currency         string  `bson:"currency"`
	CustomerContacts struct {
		Name  string `bson:"name"`
		Phone struct {
			Number      string `bson:"number"`
			CountryCode string `bson:"countryCode"`
		} `bson:"phone"`
		Email string `bson:"email"`
	} `bson:"customerContacts"`
	DeliveryInfo struct {
		Address         string `bson:"address"`
		Floor           string `bson:"floor"`
		Apartment       string `bson:"apartment"`
		DeliveryComment string `bson:"deliveryComment"`
	} `bson:"deliveryInfo"`
	StatusHistory []struct {
		Status    string    `bson:"status"`
		UpdatedAt time.Time `bson:"updatedAt"`
	} `bson:"statusHistory"`
	IsDeleted bool      `bson:"isDeleted"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
	Version   int       `bson:"version"`
}

func newFromOrder(o *order.Order) *mongoOrder {
	orderProducts := make([]struct {
		ProductId    uuid.UUID     `bson:"productId"`
		ProductName  core.MlString `bson:"productName"`
		Quantity     int64         `bson:"quantity"`
		PricePerUnit float64       `bson:"pricePerUnit"`
		TotalPrice   float64       `bson:"totalPrice"`
	}, len(o.GetProducts()))
	for i, p := range o.GetProducts() {
		orderProducts[i] = struct {
			ProductId    uuid.UUID     `bson:"productId"`
			ProductName  core.MlString `bson:"productName"`
			Quantity     int64         `bson:"quantity"`
			PricePerUnit float64       `bson:"pricePerUnit"`
			TotalPrice   float64       `bson:"totalPrice"`
		}{
			ProductId:    p.GetProductId(),
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
		Status    string    `bson:"status"`
		UpdatedAt time.Time `bson:"updatedAt"`
	}, len(o.GetStatusHistory()))
	for i, s := range o.GetStatusHistory() {
		orderStatusHistory[i] = struct {
			Status    string    `bson:"status"`
			UpdatedAt time.Time `bson:"updatedAt"`
		}{
			Status:    s.GetStatus().String(),
			UpdatedAt: s.GetUpdatedAt(),
		}
	}

	return &mongoOrder{
		Id:         o.GetId(),
		UserId:     o.GetUserId(),
		Number:     o.GetNumber().String(),
		Products:   orderProducts,
		Quantity:   o.GetQuantity(),
		TotalPrice: o.GetTotalPrice(),
		Currency:   o.GetCurrency().String(),
		CustomerContacts: struct {
			Name  string `bson:"name"`
			Phone struct {
				Number      string `bson:"number"`
				CountryCode string `bson:"countryCode"`
			} `bson:"phone"`
			Email string `bson:"email"`
		}{
			Name: orderCustomerContacts.GetName(),
			Phone: struct {
				Number      string `bson:"number"`
				CountryCode string `bson:"countryCode"`
			}{
				Number:      orderCustomerContactsPhone.GetNumber(),
				CountryCode: orderCustomerContactsPhone.GetCountryCode(),
			},
			Email: orderCustomerContactsEmail.String(),
		},
		DeliveryInfo: struct {
			Address         string `bson:"address"`
			Floor           string `bson:"floor"`
			Apartment       string `bson:"apartment"`
			DeliveryComment string `bson:"deliveryComment"`
		}{
			Address:         orderDeliveryInfo.GetAddress(),
			Floor:           orderDeliveryInfo.GetFloor(),
			Apartment:       orderDeliveryInfo.GetApartment(),
			DeliveryComment: orderDeliveryInfo.GetDeliveryComment(),
		},
		StatusHistory: orderStatusHistory,
		IsDeleted:     o.GetIsDeleted(),
		CreatedAt:     o.GetCreatedAt(),
		UpdatedAt:     o.GetUpdatedAt(),
		Version:       o.GetVersion(),
	}
}

func (m *mongoOrder) ToAggregate() *order.Order {
	var products []valueobject.OrderProduct
	for _, product := range m.Products {
		products = append(products, valueobject.UnmarshalOrderProductFromDatabase(product.ProductId, product.ProductName, product.Quantity, product.PricePerUnit, product.TotalPrice))
	}
	customerContacts := valueobject.UnmarshalCustomerContactsFromDatabase(m.CustomerContacts.Name, phone.UnmarshalPhoneFromDatabase(m.CustomerContacts.Phone.Number, m.CustomerContacts.Phone.CountryCode), m.CustomerContacts.Email)
	orderDeliveryInfo := deliveryInfo.UnmarshalDeliveryInfoFromDatabase(m.DeliveryInfo.Address, m.DeliveryInfo.Floor, m.DeliveryInfo.Apartment, m.DeliveryInfo.DeliveryComment)
	orderStatusHistory := make([]valueobject.OrderStatusHistory, len(m.StatusHistory))
	for i, s := range m.StatusHistory {
		orderStatusHistory[i] = valueobject.UnmarshalOrderStatusHistoryFromDatabase(s.Status, s.UpdatedAt)
	}
	return order.UnmarshalOrderFromDatabase(m.Id, m.UserId, m.Number, products, m.Quantity, m.TotalPrice, m.Currency, customerContacts, orderDeliveryInfo, orderStatusHistory, m.IsDeleted, m.CreatedAt, m.UpdatedAt, m.Version)
}

func (r *RepoOrder) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSort(bson.D{{"createdAt", -1}}).SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var orders []*order.Order
	for cur.Next(ctx) {
		var internal mongoOrder
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		orders = append(orders, internal.ToAggregate())
	}
	return orders, count, nil
}

func (r *RepoOrder) FindUserOrdersByFilters(ctx context.Context, offset, limit int64, isDeleted bool, userId uuid.UUID) ([]*order.Order, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted, "userId": userId})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted, "userId": userId}, options.Find().SetSort(bson.D{{"createdAt", -1}}).SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	defer cur.Close(ctx)

	var orders []*order.Order
	for cur.Next(ctx) {
		var internal mongoOrder
		if err = cur.Decode(&internal); err != nil {
			return nil, 0, err
		}
		orders = append(orders, internal.ToAggregate())
	}
	return orders, count, nil
}

func (r *RepoOrder) FindOneById(ctx context.Context, id uuid.UUID) (*order.Order, error) {
	var foundOrder mongoOrder
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&foundOrder); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return foundOrder.ToAggregate(), nil
}

func (r *RepoOrder) Create(ctx context.Context, order *order.Order) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrder(order))
	return err
}

func (r *RepoOrder) Update(ctx context.Context, order *order.Order) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": order.GetId(),
	}, bson.M{
		"$set": newFromOrder(order),
	})
	return err
}

func (r *RepoOrder) Recover(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": false,
			"updatedAt": time.Now(),
		},
		"$inc": bson.D{
			{"version", 1},
		},
	})
	return err
}

func (r *RepoOrder) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": id,
	}, bson.M{
		"$set": bson.M{
			"isDeleted": true,
			"updatedAt": time.Now(),
		},
		"$inc": bson.D{
			{"version", 1},
		},
	})
	return err
}
