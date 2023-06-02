package valueobject

import "github/nnniyaz/ardo/pkg/core"

type MerchantRole string

var (
	ErrEmptyMerchantRole   = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_MERCHANT_ROLE)
	ErrInvalidMerchantRole = core.NewI18NError(core.EINVALID, core.TXT_INVALID_MERCHANT_ROLE)
)

const (
	Owner   MerchantRole = "owner"
	Manager MerchantRole = "manager"
)

func NewMerchantRole(role string) (MerchantRole, error) {
	if role == "" {
		return "", ErrEmptyMerchantRole
	}
	merchantRole := MerchantRole(role)
	switch merchantRole {
	case Owner, Manager:
		return merchantRole, nil
	default:
		return "", ErrInvalidMerchantRole
	}
}

func (mr MerchantRole) String() string {
	return string(mr)
}
