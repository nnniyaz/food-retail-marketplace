package valueobject

import "github/nnniyaz/ardo/pkg/core"

type MerchantRole string

const (
	Owner   MerchantRole = "OWNER"
	Manager MerchantRole = "MANAGER"
)

var (
	ErrEmptyMerchantRole   = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_MERCHANT_ROLE)
	ErrInvalidMerchantRole = core.NewI18NError(core.EINVALID, core.TXT_INVALID_MERCHANT_ROLE)
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
