package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
)

type UserType string

var ErrInvalidUserType = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_TYPE)

const (
	UserTypeAdmin     UserType = "ADMIN"     // Have access to everything
	UserTypeModerator UserType = "MODERATOR" // Have access to content commands
	UserTypeClient    UserType = "CLIENT"
)

func NewUserType(userType string) (UserType, error) {
	switch userType {
	case "ADMIN", "MODERATOR", "CLIENT":
		return UserType(userType), nil
	default:
		return "", ErrInvalidUserType
	}
}

func (u UserType) String() string {
	return string(u)
}
