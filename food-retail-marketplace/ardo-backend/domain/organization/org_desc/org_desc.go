package org_desc

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type OrgDesc struct {
	orgId base.UUID
	desc  core.MlString
}

func New(orgId base.UUID, desc core.MlString) (*OrgDesc, error) {
	if desc.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return &OrgDesc{
		orgId: orgId,
		desc:  desc,
	}, nil
}

func (o *OrgDesc) GetOrgId() base.UUID {
	return o.orgId
}

func (o *OrgDesc) GetDesc() core.MlString {
	return o.desc
}

func UnmarshalOrgDescFromDatabase(orgId base.UUID, desc core.MlString) (*OrgDesc, error) {
	return &OrgDesc{
		orgId: orgId,
		desc:  desc,
	}, nil
}
