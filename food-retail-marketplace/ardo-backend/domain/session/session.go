package session

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"time"
)

type Session struct {
	id        uuid.UUID
	userID    uuid.UUID
	session   uuid.UUID
	createdAt time.Time
}

func NewSession(userID uuid.UUID) *Session {
	return &Session{
		id:        uuid.NewUUID(),
		userID:    userID,
		session:   uuid.NewUUID(),
		createdAt: time.Now(),
	}
}

func (s *Session) GetId() uuid.UUID {
	return s.userID
}

func (s *Session) GetUserId() uuid.UUID {
	return s.userID
}

func (s *Session) GetSession() uuid.UUID {
	return s.session
}

func (s *Session) GetCreatedAt() time.Time {
	return s.createdAt
}

func UnmarshalSessionFromDatabase(id uuid.UUID, userID uuid.UUID, session uuid.UUID, createdAt time.Time) *Session {
	return &Session{
		id:        id,
		userID:    userID,
		session:   session,
		createdAt: createdAt,
	}
}
