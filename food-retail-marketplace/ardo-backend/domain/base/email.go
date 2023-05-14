package base

import (
	"errors"
	"net/mail"
)

var (
	ErrorEmailIsEmpty     = errors.New("email is empty")
	ErrorEmailIsInvalid   = errors.New("email is invalid")
	ErrorEmailIsNotUnique = errors.New("email is not unique")
)

type Email string

func NewEmail(email string) (Email, error) {
	if email == "" {
		return "", ErrorEmailIsEmpty
	}

	_, err := mail.ParseAddress(email)

	if err != nil {
		return "", ErrorEmailIsInvalid
	}

	return Email(email), nil
}
