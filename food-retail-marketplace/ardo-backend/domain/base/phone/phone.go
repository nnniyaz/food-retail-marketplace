package phone

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrEmptyPhone = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_PHONE_NUMBER)
)

type Phone string

func NewPhone(phone string) (Phone, error) {
	if phone == "" {
		return "", ErrEmptyPhone
	}
	return Phone(phone), nil
}

func (p Phone) String() string {
	return string(p)
}
