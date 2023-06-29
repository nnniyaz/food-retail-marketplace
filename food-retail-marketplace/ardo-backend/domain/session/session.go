package session

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/session/valueobject"
	"time"
)

type Session struct {
	id           uuid.UUID
	userId       uuid.UUID
	session      uuid.UUID
	userAgent    valueobject.UserAgent
	lastActionAt time.Time
	createdAt    time.Time
}

func NewSession(userId uuid.UUID, userAgent string) (*Session, error) {
	ua, err := valueobject.NewUserAgent(userAgent)
	if err != nil {
		return nil, err
	}

	return &Session{
		id:           uuid.NewUUID(),
		userId:       userId,
		session:      uuid.NewUUID(),
		userAgent:    ua,
		lastActionAt: time.Now(),
		createdAt:    time.Now(),
	}, nil
}

func (s *Session) GetId() uuid.UUID {
	return s.id
}

func (s *Session) GetUserId() uuid.UUID {
	return s.userId
}

func (s *Session) GetSession() uuid.UUID {
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

func UnmarshalSessionFromDatabase(id uuid.UUID, userId uuid.UUID, session uuid.UUID, userAgent string, createdAt time.Time) (*Session, error) {
	ua, err := valueobject.NewUserAgent(userAgent)
	if err != nil {
		return nil, err
	}
	return &Session{
		id:        id,
		userId:    userId,
		session:   session,
		userAgent: ua,
		createdAt: createdAt,
	}, nil
}
