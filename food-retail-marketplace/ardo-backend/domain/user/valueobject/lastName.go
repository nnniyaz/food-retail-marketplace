package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
	"unicode/utf8"
)

const (
	minLastNameLength = 2
	maxLastNameLength = 100
)

var (
	ErrEmptyLastName    = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_LASTNAME)
	ErrLastNameTooShort = core.NewI18NError(core.EINVALID, core.TXT_LASTNAME_TOO_SHORT)
	ErrLastNameTooLong  = core.NewI18NError(core.EINVALID, core.TXT_LASTNAME_TOO_LONG)
)

type LastName string

func NewLastName(lastName string) (LastName, error) {
	if lastName == "" {
		return "", ErrEmptyLastName
	}
	if utf8.RuneCountInString(lastName) < minLastNameLength {
		return "", ErrLastNameTooShort
	}
	if utf8.RuneCountInString(lastName) > maxLastNameLength {
		return "", ErrLastNameTooLong
	}
	return LastName(lastName), nil
}

func (l LastName) String() string {
	return string(l)
}
