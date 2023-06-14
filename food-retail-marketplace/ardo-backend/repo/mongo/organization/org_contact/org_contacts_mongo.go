package org_contact

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization/org_contact"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoOrgContact struct {
	client *mongo.Client
}

func NewRepoOrgContact(client *mongo.Client) *RepoOrgContact {
	return &RepoOrgContact{client: client}
}

func (r *RepoOrgContact) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("organization_contacts")
}

type mongoOrgContact struct {
	OrgId   base.UUID `bson:"orgId"`
	Phone   string    `bson:"phone"`
	Email   string    `bson:"email"`
	Address string    `bson:"address"`
}

func newFromOrgContact(o *org_contact.OrgContact) *mongoOrgContact {
	return &mongoOrgContact{
		OrgId:   o.GetOrgId(),
		Phone:   o.GetPhone().String(),
		Email:   o.GetEmail().String(),
		Address: o.GetAddress(),
	}
}

func (m *mongoOrgContact) ToAggregate() (*org_contact.OrgContact, error) {
	return org_contact.UnmarshalOrgContactFromDatabase(m.OrgId, m.Phone, m.Email, m.Address)
}

func (r *RepoOrgContact) FindOne(ctx context.Context, orgId base.UUID) (*org_contact.OrgContact, error) {
	var o mongoOrgContact
	if err := r.Coll().FindOne(ctx, bson.M{
		"orgId": orgId,
	}).Decode(&o); err != nil {
		return nil, err
	}
	return o.ToAggregate()
}

func (r *RepoOrgContact) Create(ctx context.Context, o *org_contact.OrgContact) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrgContact(o))
	return err
}

func (r *RepoOrgContact) Update(ctx context.Context, o *org_contact.OrgContact) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"orgId": o.GetOrgId(),
	}, bson.M{
		"$set": newFromOrgContact(o),
	})
	return err
}

func (r *RepoOrgContact) Delete(ctx context.Context, orgId *base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{
		"orgId": orgId,
	})
	return err
}
