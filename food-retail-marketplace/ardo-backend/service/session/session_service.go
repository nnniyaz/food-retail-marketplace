package session

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/repo"
)

type SessionService interface {
	Create(ctx context.Context, userId, userAgent string) (*session.Session, error)
	GetAllByUserId(ctx context.Context, userId string) ([]*session.Session, error)
	GetOneBySession(ctx context.Context, session string) (*session.Session, error)
	DeleteOneBySessionId(ctx context.Context, id string) error
	DeleteOneByToken(ctx context.Context, token string) error
	UpdateLastActionAt(ctx context.Context, session string) error
}

type sessionService struct {
	sessionRepo repo.Session
}

func NewSessionService(repo repo.Session) SessionService {
	return &sessionService{sessionRepo: repo}
}

func (s *sessionService) Create(ctx context.Context, userId, userAgent string) (*session.Session, error) {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	newSession, err := session.NewSession(convertedUserId, userAgent)
	if err != nil {
		return nil, err
	}
	if err = s.sessionRepo.Create(ctx, newSession); err != nil {
		return nil, err
	}
	return newSession, nil
}

func (s *sessionService) GetAllByUserId(ctx context.Context, userId string) ([]*session.Session, error) {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	sessions, err := s.sessionRepo.FindManyByUserId(ctx, convertedUserId)
	if err != nil {
		return nil, err
	}
	return sessions, nil
}

func (s *sessionService) GetOneBySession(ctx context.Context, session string) (*session.Session, error) {
	convertedToken, err := base.UUIDFromString(session)
	if err != nil {
		return nil, err
	}
	return s.sessionRepo.FindOneBySession(ctx, convertedToken)
}

func (s *sessionService) DeleteOneBySessionId(ctx context.Context, sessionId string) error {
	convertedSessionId, err := base.UUIDFromString(sessionId)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteById(ctx, convertedSessionId)
}

func (s *sessionService) DeleteOneByToken(ctx context.Context, token string) error {
	convertedToken, err := base.UUIDFromString(token)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteByToken(ctx, convertedToken)
}

func (s *sessionService) UpdateLastActionAt(ctx context.Context, sessionId string) error {
	convertedSession, err := base.UUIDFromString(sessionId)
	if err != nil {
		return err
	}
	return s.sessionRepo.UpdateLastActionAt(ctx, convertedSession)
}
