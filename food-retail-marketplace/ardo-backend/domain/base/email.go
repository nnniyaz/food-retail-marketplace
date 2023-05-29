package base

import (
	"errors"
	"net/mail"
)

var (
	ErrorEmailIsEmpty       = errors.New("email is empty")
	ErrorEmailIsInvalid     = errors.New("email is invalid")
	ErrorEmailAlreadyExists = errors.New("email already exists")
)

type Email string

func NewEmail(email string) (Email, error) {
	if _, err := mail.ParseAddress(email); err != nil {
		return "", ErrorEmailIsInvalid
	}
	return Email(email), nil
}

func (e Email) String() string {
	return string(e)
}
