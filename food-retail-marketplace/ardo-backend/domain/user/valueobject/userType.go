package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
)

type UserType string

var ErrInvalidUserType = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_TYPE)

// USER TYPES ACCESS LEVEL
//
// - STAFF
// ADMIN - Have access to everything
// DEVELOPER - Have access to everything except high level commands
// MODERATOR - Have access to content commands
//
// - MERCHANT STAFF
// MERCHANT - Have full access to own organization
// MANAGER - Have access to content of organization
//
// - END-USERS
// CLIENT - ...

const (
	UserTypeAdmin     UserType = "ADMIN"     // Have access to everything
	UserTypeDeveloper UserType = "DEVELOPER" // Have access to everything except high level commands
	UserTypeModerator UserType = "MODERATOR" // Have access to content commands
	UserTypeMerchant  UserType = "MERCHANT"  // Have full access to own organization
	UserTypeManager   UserType = "MANAGER"   // Have access to content of organization
	UserTypeClient    UserType = "CLIENT"
)

func NewUserType(userType string) (UserType, error) {
	switch userType {
	case "ADMIN", "DEVELOPER", "MODERATOR", "MERCHANT", "MANAGER", "CLIENT":
		return UserType(userType), nil
	default:
		return "", ErrInvalidUserType
	}
}

func (u UserType) String() string {
	return string(u)
}
