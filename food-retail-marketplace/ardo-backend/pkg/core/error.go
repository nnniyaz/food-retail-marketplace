package core

import "fmt"

type ErrCode string

const (
	EINTERNAL     ErrCode = "internal"
	ENOTFOUND     ErrCode = "not_found"
	EINVALID      ErrCode = "invalid"
	ECONFLICT     ErrCode = "conflict"
	EUNAUTHORIZED ErrCode = "unauthorized"
	EFORBIDDEN    ErrCode = "forbidden"
)

type I18NError struct {
	Code   ErrCode
	TxtKey TxtKey
	Args   []interface{}
}

func NewI18NError(code ErrCode, txtKey TxtKey, args ...interface{}) *I18NError {
	if code == "" {
		code = EINTERNAL
	}
	if txtKey == 0 {
		txtKey = TXT_UNKNOWN_ERROR
	}
	return &I18NError{code, txtKey, args}
}

func (i *I18NError) Error() string {
	return fmt.Sprintf("%q[%s]", fmt.Sprintf(GetTxtKeyAsString(i.TxtKey), i.Args...), string(i.Code))
}

func (i *I18NError) ErrMsg() string {
	return fmt.Sprintf(Txts[i.TxtKey].GetByLangOrEmpty(RU), i.Args...)
}
