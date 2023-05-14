package domain

import "github/nnniyaz/ardo/domain/base"

type Login struct {
	Email    base.Email `json:"email" bson:"email"`
	Password string     `json:"password" bson:"password"`
}

type Register struct {
	Email     base.Email `json:"email" bson:"email"`
	Password  string     `json:"password" bson:"password"`
	FirstName string     `json:"firstName" bson:"firstName"`
	LastName  string     `json:"lastName" bson:"lastName"`
}
