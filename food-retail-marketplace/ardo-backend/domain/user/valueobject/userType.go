package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
)

type UserType string

var ErrInvalidUserType = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_TYPE)

const (
	UserTypeClient   UserType = "CLIENT"
	UserTypeMerchant UserType = "MERCHANT"
	UserTypeStaff    UserType = "STAFF"
)

func NewUserType(userType string) (UserType, error) {
	switch userType {
	case "CLIENT", "MERCHANT", "STAFF":
		return UserType(userType), nil
	default:
		return "", ErrInvalidUserType
	}
}

func (u UserType) String() string {
	return string(u)
}
