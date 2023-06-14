package org_name

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization/org_name"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoOrgName struct {
	client *mongo.Client
}

func NewRepoOrgName(client *mongo.Client) *RepoOrgName {
	return &RepoOrgName{client: client}
}

func (r *RepoOrgName) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("organization_names")
}

type mongoOrgName struct {
	OrgId base.UUID     `bson:"orgId"`
	Name  core.MlString `bson:"name"`
}

func newFromOrgName(o *org_name.OrgName) *mongoOrgName {
	return &mongoOrgName{
		OrgId: o.GetOrgId(),
		Name:  o.GetName(),
	}
}

func (m *mongoOrgName) ToAggregate() (*org_name.OrgName, error) {
	return org_name.UnmarshalOrgNameFromDatabase(m.OrgId, m.Name)
}

func (r *RepoOrgName) FindOne(ctx context.Context, orgId base.UUID) (*org_name.OrgName, error) {
	var o mongoOrgName
	if err := r.Coll().FindOne(ctx, bson.M{
		"orgId": orgId,
	}).Decode(&o); err != nil {
		return nil, err
	}
	return o.ToAggregate()
}

func (r *RepoOrgName) Create(ctx context.Context, o *org_name.OrgName) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrgName(o))
	return err
}

func (r *RepoOrgName) Update(ctx context.Context, o *org_name.OrgName) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"orgId": o.GetOrgId(),
	}, bson.M{
		"$set": newFromOrgName(o),
	})
	return err
}

func (r *RepoOrgName) Delete(ctx context.Context, orgId base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"orgId": orgId})
	return err
}
