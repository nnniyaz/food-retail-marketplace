package domain

import (
	"errors"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain/base"
	"time"
)

var (
	ErrorUserNotFound        = errors.New("user not found")
	ErrorFirstNameIsEmpty    = errors.New("first name is empty")
	ErrorFirstNameLessThan3  = errors.New("first name is less than 3")
	ErrorFirstNameMoreThan50 = errors.New("first name is more than 50")
	ErrorLastNameIsEmpty     = errors.New("last name is empty")
	ErrorLastNameLessThan3   = errors.New("last name is less than 3")
	ErrorLastNameMoreThan50  = errors.New("last name is more than 50")
	ErrorPasswordIsEmpty     = errors.New("password is empty")
	ErrorPasswordLessThan3   = errors.New("password is less than 3")
	ErrorPasswordMoreThan32  = errors.New("password is more than 32")
)

type User struct {
	Id        uuid.UUID     `json:"id" bson:"_id"`
	FirstName string        `json:"firstName" bson:"firstName"`
	LastName  string        `json:"lastName" bson:"lastName"`
	Email     base.Email    `json:"email" bson:"email"`
	Password  string        `json:"password" bson:"password"`
	UserType  base.UserType `json:"userType" bson:"userType"`
	IsDeleted bool          `json:"isDeleted" bson:"isDeleted"`
	CreatedAt time.Time     `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt" bson:"updatedAt"`
}
