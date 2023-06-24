package session

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/session/valueobject"
	"time"
)

type Session struct {
	id           base.UUID
	userID       base.UUID
	session      base.UUID
	userAgent    valueobject.UserAgent
	lastActionAt time.Time
	createdAt    time.Time
}

func NewSession(userID base.UUID, userAgent string) (*Session, error) {
	ua, err := valueobject.NewUserAgent(userAgent)
	if err != nil {
		return nil, err
	}

	return &Session{
		id:           base.NewUUID(),
		userID:       userID,
		session:      base.NewUUID(),
		userAgent:    ua,
		lastActionAt: time.Now(),
		createdAt:    time.Now(),
	}, nil
}

func (s *Session) GetId() base.UUID {
	return s.id
}

func (s *Session) GetUserId() base.UUID {
	return s.userID
}

func (s *Session) GetSession() base.UUID {
	return s.session
}

func (s *Session) GetUserAgent() valueobject.UserAgent {
	return s.userAgent
}

func (s *Session) GetLastActionAt() time.Time {
	return s.lastActionAt
}

func (s *Session) GetCreatedAt() time.Time {
	return s.createdAt
}

func (s *Session) UpdateLastActionAt() {
	s.lastActionAt = time.Now()
}

func UnmarshalSessionFromDatabase(id base.UUID, userID base.UUID, session base.UUID, userAgent string, createdAt time.Time) (*Session, error) {
	ua, err := valueobject.NewUserAgent(userAgent)
	if err != nil {
		return nil, err
	}
	return &Session{
		id:        id,
		userID:    userID,
		session:   session,
		userAgent: ua,
		createdAt: createdAt,
	}, nil
}
