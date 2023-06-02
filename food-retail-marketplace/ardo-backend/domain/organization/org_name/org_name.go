package org_name

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type OrgName struct {
	orgId base.UUID
	name  core.MlString
}

func New(orgId base.UUID, name core.MlString) (*OrgName, error) {
	if name.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &OrgName{
		orgId: orgId,
		name:  name,
	}, nil
}

func (o *OrgName) GetOrgId() base.UUID {
	return o.orgId
}

func (o *OrgName) GetName() core.MlString {
	return o.name
}

func UnmarshalOrgNameFromDatabase(orgId base.UUID, name core.MlString) (*OrgName, error) {
	return &OrgName{
		orgId: orgId,
		name:  name,
	}, nil
}
