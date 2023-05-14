package domain

import (
	"errors"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain/base"
)

var (
	ErrorUserNotFound = errors.New("user not found")
)

type User struct {
	Id        uuid.UUID  `json:"id" bson:"_id"`
	FirstName string     `json:"firstName" bson:"firstName"`
	LastName  string     `json:"lastName" bson:"lastName"`
	Email     base.Email `json:"email" bson:"email"`
	Password  string     `json:"password" bson:"password"`
}
