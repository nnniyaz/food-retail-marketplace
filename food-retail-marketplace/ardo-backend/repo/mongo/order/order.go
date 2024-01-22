package order

import (
	"context"
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

type mongoOrderProduct struct {
	ProductId   uuid.UUID     `bson:"productId"`
	ProductName core.MlString `bson:"productName"`
	Quantity    int           `bson:"quantity"`
	TotalPrice  float64       `bson:"totalPrice"`
}

func newFromOrderProducts(o []valueobject.OrderProduct) []mongoOrderProduct {
	m := make([]mongoOrderProduct, len(o))
	for i, orderProduct := range o {
		m[i] = mongoOrderProduct{
			ProductId:   orderProduct.GetProductId(),
			ProductName: orderProduct.GetProductName(),
			Quantity:    orderProduct.GetQuantity(),
			TotalPrice:  orderProduct.GetTotalPrice(),
		}
	}
	return m
}

func (m *mongoOrderProduct) ToAggregate() valueobject.OrderProduct {
	return valueobject.UnmarshalOrderProductFromDatabase(m.ProductId, m.ProductName, m.Quantity, m.TotalPrice)
}

type mongoCustomerContacts struct {
	Name  string `bson:"name"`
	Phone string `bson:"phone"`
	Email string `bson:"email"`
}

func newFromCustomerContacts(c valueobject.CustomerContacts) mongoCustomerContacts {
	return mongoCustomerContacts{
		Name:  c.GetName(),
		Phone: c.GetPhone(),
		Email: c.GetEmail().String(),
	}
}

func (m *mongoCustomerContacts) ToAggregate() valueobject.CustomerContacts {
	return valueobject.UnmarshalCustomerContactsFromDatabase(m.Name, m.Phone, m.Email)
}

type mongoDeliveryInfo struct {
	Address         string `bson:"address"`
	Floor           string `bson:"floor"`
	Apartment       string `bson:"apartment"`
	DeliveryComment string `bson:"deliveryComment"`
}

func newFromDeliveryInfo(d valueobject.DeliveryInfo) mongoDeliveryInfo {
	return mongoDeliveryInfo{
		Address:         d.GetAddress(),
		Floor:           d.GetFloor(),
		Apartment:       d.GetApartment(),
		DeliveryComment: d.GetDeliveryComment(),
	}
}

func (m *mongoDeliveryInfo) ToAggregate() valueobject.DeliveryInfo {
	return valueobject.UnmarshalDeliveryInfoFromDatabase(m.Address, m.Floor, m.Apartment, m.DeliveryComment)
}

type mongoOrder struct {
	Id               uuid.UUID             `bson:"_id"`
	UserId           uuid.UUID             `bson:"userId"`
	Products         []mongoOrderProduct   `bson:"products"`
	Quantity         int                   `bson:"quantity"`
	TotalPrice       float64               `bson:"totalPrice"`
	CustomerContacts mongoCustomerContacts `bson:"customerContacts"`
	DeliveryInfo     mongoDeliveryInfo     `bson:"deliveryInfo"`
	OrderComment     string                `bson:"orderComment"`
	Status           string                `bson:"status"`
	IsDeleted        bool                  `bson:"isDeleted"`
	CreatedAt        time.Time             `bson:"createdAt"`
	UpdatedAt        time.Time             `bson:"updatedAt"`
}

func newFromOrder(o *order.Order) *mongoOrder {
	return &mongoOrder{
		Id:               o.GetId(),
		UserId:           o.GetUserId(),
		Products:         newFromOrderProducts(o.GetProducts()),
		Quantity:         o.GetQuantity(),
		TotalPrice:       o.GetTotalPrice(),
		CustomerContacts: newFromCustomerContacts(o.GetCustomerContacts()),
		DeliveryInfo:     newFromDeliveryInfo(o.GetDeliveryInfo()),
		OrderComment:     o.GetOrderComment(),
		Status:           o.GetStatus().String(),
		IsDeleted:        o.GetIsDeleted(),
		CreatedAt:        o.GetCreatedAt(),
		UpdatedAt:        o.GetUpdatedAt(),
	}
}

func (m *mongoOrder) ToAggregate() *order.Order {
	var products []valueobject.OrderProduct
	for _, product := range m.Products {
		products = append(products, product.ToAggregate())
	}
	return order.UnmarshalOrderFromDatabase(m.Id, m.UserId, products, m.Quantity, m.TotalPrice, m.CustomerContacts.ToAggregate(), m.DeliveryInfo.ToAggregate(), m.OrderComment, m.Status, m.IsDeleted, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoOrder) FindByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*order.Order, int64, error) {
	count, err := r.Coll().CountDocuments(ctx, bson.M{"isDeleted": isDeleted})
	if err != nil {
		return nil, 0, err
	}
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted}, options.Find().SetSkip(offset).SetLimit(limit))
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
	cur, err := r.Coll().Find(ctx, bson.M{"isDeleted": isDeleted, "userId": userId}, options.Find().SetSkip(offset).SetLimit(limit))
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
		if err == mongo.ErrNoDocuments {
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
	})
	return err
}
