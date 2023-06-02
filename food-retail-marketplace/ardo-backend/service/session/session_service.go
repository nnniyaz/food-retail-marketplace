package session

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/session"
	"github/nnniyaz/ardo/repo"
)

type SessionService interface {
	Create(ctx context.Context, userId string) (*session.Session, error)
	GetAllByUserId(ctx context.Context, userId string) ([]*session.Session, error)
	DeleteOneBySessionId(ctx context.Context, id string) error
	DeleteOneByToken(ctx context.Context, token string) error
}

type sessionService struct {
	sessionRepo repo.Session
}

func NewSessionService(repo repo.Session) SessionService {
	return &sessionService{sessionRepo: repo}
}

func (s *sessionService) Create(ctx context.Context, userId string) (*session.Session, error) {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	newSession := session.NewSession(convertedUserId)
	err = s.sessionRepo.CreateSession(ctx, newSession)
	if err != nil {
		return nil, err
	}
	return newSession, nil
}

func (s *sessionService) GetAllByUserId(ctx context.Context, userId string) ([]*session.Session, error) {
	convertedUserId, err := base.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	sessions, err := s.sessionRepo.GetSessionsByUserId(ctx, convertedUserId)
	if err != nil {
		return nil, err
	}
	return sessions, nil
}

func (s *sessionService) DeleteOneBySessionId(ctx context.Context, sessionId string) error {
	convertedSessionId, err := base.UUIDFromString(sessionId)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteSessionById(ctx, convertedSessionId)
}

func (s *sessionService) DeleteOneByToken(ctx context.Context, token string) error {
	convertedToken, err := base.UUIDFromString(token)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteSessionByToken(ctx, convertedToken)
}
