package base

import "errors"

type UserType string

var (
	ErrorInvalidUserType = errors.New("invalid user type")
)

const (
	UserTypeClient   UserType = "client"
	UserTypeMerchant UserType = "merchant"
	UserTypeStaff    UserType = "staff"
)

func (u UserType) String() string {
	return string(u)
}

func NewUserType(userType UserType) (UserType, error) {
	switch userType {
	case UserTypeClient, UserTypeMerchant, UserTypeStaff:
		return userType, nil
	default:
		return "", ErrorInvalidUserType
	}
}
