package domain

import "github/nnniyaz/ardo/domain/base"

type Login struct {
	Email    base.Email `json:"email" bson:"email"`
	Password string     `json:"password" bson:"password"`
}

func (l *Login) Validate() error {
	if l.Email == "" {
		return base.ErrorEmailIsEmpty
	}

	if l.Password == "" {
		return ErrorPasswordIsEmpty
	}

	return nil
}

type Register struct {
	Email     base.Email `json:"email" bson:"email"`
	Password  string     `json:"password" bson:"password"`
	FirstName string     `json:"firstName" bson:"firstName"`
	LastName  string     `json:"lastName" bson:"lastName"`
}

func (r *Register) Validate() error {
	if r.Email == "" {
		return base.ErrorEmailIsEmpty
	}

	if r.Password == "" {
		return ErrorPasswordIsEmpty
	}

	if len(r.Password) < 3 {
		return ErrorPasswordLessThan3
	}

	if len(r.Password) > 32 {
		return ErrorPasswordMoreThan32
	}

	if r.FirstName == "" {
		return ErrorFirstNameIsEmpty
	}

	if len(r.FirstName) < 3 {
		return ErrorFirstNameLessThan3
	}

	if len(r.FirstName) > 50 {
		return ErrorFirstNameMoreThan50
	}

	if r.LastName == "" {
		return ErrorLastNameIsEmpty
	}

	if len(r.LastName) < 3 {
		return ErrorLastNameLessThan3
	}

	if len(r.LastName) > 50 {
		return ErrorLastNameMoreThan50
	}

	return nil
}
