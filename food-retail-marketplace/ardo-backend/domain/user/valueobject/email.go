package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
	"net/mail"
)

var (
	ErrorEmailIsEmpty   = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_EMAIL)
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
