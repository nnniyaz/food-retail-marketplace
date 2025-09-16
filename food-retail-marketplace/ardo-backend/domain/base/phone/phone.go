package phone

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrEmptyPhone       = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_PHONE_NUMBER)
	ErrEmptyCountryCode = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_COUNTRY_CODE)
)

type Phone struct {
	number      string
	countryCode string
}

func NewPhone(number string, countryCode string) (Phone, error) {
	if number == "" {
		return Phone{}, ErrEmptyPhone
	}
	if countryCode == "" {
		return Phone{}, ErrEmptyCountryCode
	}
	return Phone{
		number:      number,
		countryCode: countryCode,
	}, nil
}

func (p *Phone) GetNumber() string {
	return p.number
}

func (p *Phone) GetCountryCode() string {
	return p.countryCode
}

func (p *Phone) String() string {
	return p.countryCode + p.number
}

func UnmarshalPhoneFromDatabase(number string, countryCode string) Phone {
	return Phone{
		number:      number,
		countryCode: countryCode,
	}
}
