package user

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"github/nnniyaz/ardo/pkg/core"
	"time"
)

var (
	ErrSamePassword = core.NewI18NError(core.EINVALID, core.TXT_SAME_PASSWORD)
)

type User struct {
	id        base.UUID
	firstName valueobject.FirstName
	lastName  valueobject.LastName
	email     valueobject.Email
	password  valueobject.Password
	userType  valueobject.UserType
	isDeleted bool
	createdAt time.Time
	updatedAt time.Time
}

func NewUser(firstName, lastName, email, password, userType string) (*User, error) {
	userId := base.NewUUID()

	userFirstName, err := valueobject.NewFirstName(firstName)
	if err != nil {
		return nil, err
	}

	userLastName, err := valueobject.NewLastName(lastName)
	if err != nil {
		return nil, err
	}

	userEmail, err := valueobject.NewEmail(email)
	if err != nil {
		return nil, err
	}

	userPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return nil, err
	}

	userUserType, err := valueobject.NewUserType(userType)
	if err != nil {
		return nil, err
	}

	return &User{
		id:        userId,
		firstName: userFirstName,
		lastName:  userLastName,
		email:     userEmail,
		password:  userPassword,
		userType:  userUserType,
		isDeleted: false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (u *User) GetId() base.UUID {
	return u.id
}

func (u *User) GetFirstName() valueobject.FirstName {
	return u.firstName
}

func (u *User) GetLastName() valueobject.LastName {
	return u.lastName
}

func (u *User) GetEmail() valueobject.Email {
	return u.email
}

func (u *User) GetPassword() valueobject.Password {
	return u.password
}

func (u *User) GetUserType() valueobject.UserType {
	return u.userType
}

func (u *User) GetIsDeleted() bool {
	return u.isDeleted
}

func (u *User) GetCreatedAt() time.Time {
	return u.createdAt
}

func (u *User) GetUpdatedAt() time.Time {
	return u.updatedAt
}

func (u *User) ComparePassword(password string) bool {
	return u.password.Compare(password)
}

func (u *User) ChangePassword(password string) error {
	if u.ComparePassword(password) {
		return ErrSamePassword
	}
	newPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return err
	}
	u.password = newPassword
	return nil
}

func UnmarshalUserFromDatabase(id base.UUID, firstName, lastName, email, userType string, password valueobject.Password, isDeleted bool, createdAt, updatedAt time.Time) *User {
	return &User{
		id:        id,
		firstName: valueobject.FirstName(firstName),
		lastName:  valueobject.LastName(lastName),
		email:     valueobject.Email(email),
		password:  password,
		userType:  valueobject.UserType(userType),
		isDeleted: isDeleted,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
