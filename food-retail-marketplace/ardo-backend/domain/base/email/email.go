package email

import (
	"github/nnniyaz/ardo/pkg/core"
	"net/mail"
)

var (
	ErrorEmailIsInvalid = core.NewI18NError(core.EINVALID, core.TXT_INVALID_EMAIL)
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

func (e Email) Validate() error {
	if _, err := mail.ParseAddress(e.String()); err != nil {
		return ErrorEmailIsInvalid
	}
	return nil
}
