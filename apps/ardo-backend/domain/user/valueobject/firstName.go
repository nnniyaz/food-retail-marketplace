package valueobject

import (
	"github/nnniyaz/ardo/pkg/core"
	"unicode/utf8"
)

const (
	minFirstNameLength = 2
	maxFirstNameLength = 100
)

var (
	ErrEmptyFirstName    = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_FIRSTNAME)
	ErrFirstNameTooShort = core.NewI18NError(core.EINVALID, core.TXT_FIRSTNAME_TOO_SHORT)
	ErrFirstNameTooLong  = core.NewI18NError(core.EINVALID, core.TXT_FIRSTNAME_TOO_LONG)
)

type FirstName string

func NewFirstName(firstName string) (FirstName, error) {
	if firstName == "" {
		return "", ErrEmptyFirstName
	}
	if utf8.RuneCountInString(firstName) < minFirstNameLength {
		return "", ErrFirstNameTooShort
	}
	if utf8.RuneCountInString(firstName) > maxFirstNameLength {
		return "", ErrFirstNameTooLong
	}
	return FirstName(firstName), nil
}

func (f FirstName) String() string {
	return string(f)
}
