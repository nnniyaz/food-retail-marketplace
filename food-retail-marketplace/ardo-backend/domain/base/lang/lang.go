package lang

import "github/nnniyaz/ardo/pkg/core"

var (
	ErrEmptyLang   = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_LANG)
	ErrInvalidLang = core.NewI18NError(core.EINVALID, core.TXT_INVALID_LANG)
)

type Lang string

const (
	RU Lang = "RU"
	EN Lang = "EN"
)

func NewLang(lang string) (Lang, error) {
	if lang == "" {
		return "", ErrEmptyLang
	}
	switch lang {
	case "RU", "EN":
		return Lang(lang), nil
	default:
		return "", ErrInvalidLang
	}
}

func (l Lang) String() string {
	return string(l)
}

func GetLangs() []Lang {
	return []Lang{RU, EN}
}
