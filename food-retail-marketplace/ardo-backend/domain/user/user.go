package user

import (
	"github/nnniyaz/ardo/domain/base/email"
	"github/nnniyaz/ardo/domain/base/lang"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user/exceptions"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"time"
)

type User struct {
	id            uuid.UUID
	firstName     valueobject.FirstName
	lastName      valueobject.LastName
	email         email.Email
	password      valueobject.Password
	userType      valueobject.UserType
	preferredLang lang.Lang
	isDeleted     bool
	createdAt     time.Time
	updatedAt     time.Time
}

func NewUser(firstName, lastName, mail, password, userType, preferredLang string) (*User, error) {
	userId := uuid.NewUUID()

	userFirstName, err := valueobject.NewFirstName(firstName)
	if err != nil {
		return nil, err
	}

	userLastName, err := valueobject.NewLastName(lastName)
	if err != nil {
		return nil, err
	}

	userEmail, err := email.NewEmail(mail)
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

	userPreferredLang, err := lang.NewLang(preferredLang)
	if err != nil {
		return nil, err
	}

	return &User{
		id:            userId,
		firstName:     userFirstName,
		lastName:      userLastName,
		email:         userEmail,
		password:      userPassword,
		userType:      userUserType,
		preferredLang: userPreferredLang,
		isDeleted:     false,
		createdAt:     time.Now(),
		updatedAt:     time.Now(),
	}, nil
}

func (u *User) GetId() uuid.UUID {
	return u.id
}

func (u *User) GetFirstName() valueobject.FirstName {
	return u.firstName
}

func (u *User) GetLastName() valueobject.LastName {
	return u.lastName
}

func (u *User) GetEmail() email.Email {
	return u.email
}

func (u *User) GetPassword() valueobject.Password {
	return u.password
}

func (u *User) GetUserType() valueobject.UserType {
	return u.userType
}

func (u *User) GetUserPreferredLang() lang.Lang {
	return u.preferredLang
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

func (u *User) UpdateCredentials(firstName, lastName string) error {
	userFirstName, err := valueobject.NewFirstName(firstName)
	if err != nil {
		return err
	}
	userLastName, err := valueobject.NewLastName(lastName)
	if err != nil {
		return err
	}
	u.firstName = userFirstName
	u.lastName = userLastName
	u.updatedAt = time.Now()
	return nil
}

func (u *User) UpdateEmail(mail string) error {
	userEmail, err := email.NewEmail(mail)
	if err != nil {
		return err
	}
	u.email = userEmail
	u.updatedAt = time.Now()
	return nil
}

func (u *User) UpdateLanguage(preferredLang string) error {
	userPreferredLang, err := lang.NewLang(preferredLang)
	if err != nil {
		return err
	}
	u.preferredLang = userPreferredLang
	u.updatedAt = time.Now()
	return nil
}

func (u *User) ComparePassword(password string) bool {
	return u.password.Compare(password)
}

func (u *User) ChangePassword(password string) error {
	if u.ComparePassword(password) {
		return exceptions.ErrSamePassword
	}
	newPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return err
	}
	u.password = newPassword
	u.updatedAt = time.Now()
	return nil
}

func UnmarshalUserFromDatabase(id uuid.UUID, firstName, lastName, mail, userType, preferredLang string, password valueobject.Password, isDeleted bool, createdAt, updatedAt time.Time) *User {
	return &User{
		id:            id,
		firstName:     valueobject.FirstName(firstName),
		lastName:      valueobject.LastName(lastName),
		email:         email.Email(mail),
		password:      password,
		userType:      valueobject.UserType(userType),
		preferredLang: lang.Lang(preferredLang),
		isDeleted:     isDeleted,
		createdAt:     createdAt,
		updatedAt:     updatedAt,
	}
}
