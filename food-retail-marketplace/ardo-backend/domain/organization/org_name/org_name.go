package org_name

import (
	"github/nnniyaz/ardo/pkg/core"
	"unicode/utf8"
)

const (
	minOrgNameLength = 3
	maxOrgNameLength = 50
)

var (
	ErrEmptyOrgName    = core.NewI18NError(core.EINVALID, core.TXT_EMPTY_ORG_NAME)
	ErrOrgNameTooShort = core.NewI18NError(core.EINVALID, core.TXT_ORG_NAME_TOO_SHORT)
	ErrOrgNameTooLong  = core.NewI18NError(core.EINVALID, core.TXT_ORG_NAME_TOO_LONG)
)

type OrgName string

func New(name string) (OrgName, error) {
	if name == "" {
		return "", ErrEmptyOrgName
	}
	if utf8.RuneCountInString(name) < minOrgNameLength {
		return "", ErrOrgNameTooShort
	}
	if utf8.RuneCountInString(name) > maxOrgNameLength {
		return "", ErrOrgNameTooLong
	}
	return OrgName(name), nil
}

func (o OrgName) String() string {
	return string(o)
}
