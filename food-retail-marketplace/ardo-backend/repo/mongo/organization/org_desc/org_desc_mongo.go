package org_desc

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/organization/org_desc"
	"github/nnniyaz/ardo/pkg/core"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoOrgDesc struct {
	client mongo.Client
}

func NewRepoOrgDesc(client mongo.Client) *RepoOrgDesc {
	return &RepoOrgDesc{client: client}
}

func (r *RepoOrgDesc) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("organization_descriptions")
}

type mongoOrgDesc struct {
	OrgId base.UUID     `bson:"orgId"`
	Desc  core.MlString `bson:"desc"`
}

func newFromOrgDesc(o *org_desc.OrgDesc) *mongoOrgDesc {
	return &mongoOrgDesc{
		OrgId: o.GetOrgId(),
		Desc:  o.GetDesc(),
	}
}

func (m *mongoOrgDesc) ToAggregate() (*org_desc.OrgDesc, error) {
	return org_desc.UnmarshalOrgDescFromDatabase(m.OrgId, m.Desc)
}

func (r *RepoOrgDesc) FindOne(ctx context.Context, orgId base.UUID) (*org_desc.OrgDesc, error) {
	var o mongoOrgDesc
	if err := r.Coll().FindOne(ctx, bson.D{{"orgId", orgId}}).Decode(&o); err != nil {
		return nil, err
	}
	return o.ToAggregate()
}

func (r *RepoOrgDesc) Create(ctx context.Context, o *org_desc.OrgDesc) error {
	_, err := r.Coll().InsertOne(ctx, newFromOrgDesc(o))
	return err
}

func (r *RepoOrgDesc) Update(ctx context.Context, o *org_desc.OrgDesc) error {
	_, err := r.Coll().UpdateOne(ctx, bson.D{{"orgId", o.GetOrgId()}}, bson.D{{"$set", newFromOrgDesc(o)}})
	return err
}

func (r *RepoOrgDesc) Delete(ctx context.Context, o *org_desc.OrgDesc) error {
	_, err := r.Coll().DeleteOne(ctx, newFromOrgDesc(o))
	return err
}
