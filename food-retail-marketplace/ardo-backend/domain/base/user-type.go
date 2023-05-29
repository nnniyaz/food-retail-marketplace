package base

import "errors"

type UserType string

var ErrorInvalidUserType = errors.New("invalid user type")

const (
	UserTypeClient   UserType = "client"
	UserTypeMerchant UserType = "merchant"
	UserTypeStaff    UserType = "staff"
)

func NewUserType(userType string) (UserType, error) {
	switch userType {
	case "client":
		return UserTypeClient, nil
	case "merchant":
		return UserTypeMerchant, nil
	case "staff":
		return UserTypeStaff, nil
	default:
		return "", ErrorInvalidUserType
	}
}

func (u UserType) String() string {
	return string(u)
}
