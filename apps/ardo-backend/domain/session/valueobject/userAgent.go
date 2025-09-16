package valueobject

import "github/nnniyaz/ardo/pkg/core"

var ErrUserAgentEmpty = core.NewI18NError(core.EINVALID, core.TXT_USER_AGENT_EMPTY)

type UserAgent string

func NewUserAgent(userAgent string) (UserAgent, error) {
	if userAgent == "" {
		return "", ErrUserAgentEmpty
	}
	return UserAgent(userAgent), nil
}

func (u UserAgent) String() string {
	return string(u)
}
