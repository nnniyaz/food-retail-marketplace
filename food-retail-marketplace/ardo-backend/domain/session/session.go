package session

import (
	"github/nnniyaz/ardo/domain/base"
	"time"
)

type Session struct {
	id        base.UUID
	userID    base.UUID
	session   base.UUID
	createdAt time.Time
}

func NewSession(userID base.UUID) *Session {
	return &Session{
		id:        base.NewUUID(),
		userID:    userID,
		session:   base.NewUUID(),
		createdAt: time.Now(),
	}
}

func (s *Session) GetId() base.UUID {
	return s.userID
}

func (s *Session) GetUserId() base.UUID {
	return s.userID
}

func (s *Session) GetSession() base.UUID {
	return s.session
}

func (s *Session) GetCreatedAt() time.Time {
	return s.createdAt
}
