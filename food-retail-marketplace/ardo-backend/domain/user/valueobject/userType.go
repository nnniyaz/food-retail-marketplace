package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
)

type UserType string

var ErrInvalidUserType = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_TYPE)

const (
	UserTypeClient   UserType = "client"
	UserTypeMerchant UserType = "merchant"
	UserTypeStaff    UserType = "staff"
)

func NewUserType(userType string) (UserType, error) {
	switch userType {
	case "client", "merchant", "staff":
		return UserType(userType), nil
	default:
		return "", ErrInvalidUserType
	}
}

func (u UserType) String() string {
	return string(u)
}
