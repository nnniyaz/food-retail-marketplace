package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
)

var (
	ErrEmptyMlString = core.NewI18NError(core.EINVALID, core.TXT_WRONG_MLSTRING_FORMAT)
)

type OrgDesc core.MlString

func NewOrgDesc(desc *core.MlString) (OrgDesc, error) {
	if desc.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return OrgDesc(*desc), nil
}

func UnmarshalOrgDescFromDatabase(desc core.MlString) (*OrgDesc, error) {
	if desc.IsEmpty() {
		return nil, ErrEmptyMlString
	}
	return (*OrgDesc)(&desc), nil
}
