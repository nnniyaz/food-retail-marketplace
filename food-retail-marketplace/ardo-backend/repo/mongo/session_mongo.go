package mongo

import (
	"context"
	"errors"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoSession struct {
	client mongo.Client
}

func NewRepoSession(client mongo.Client) *RepoSession {
	return &RepoSession{client: client}
}

func (r *RepoSession) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("sessions")
}

func (r *RepoSession) CreateSession(ctx context.Context, session domain.Session) error {
	_, err := r.Coll().InsertOne(ctx, session)
	if err != nil {
		return err
	}
	return nil
}

func (r *RepoSession) GetSessionsByUserId(ctx context.Context, userId uuid.UUID) ([]domain.Session, error) {
	var sessions []domain.Session
	cur, err := r.Coll().Find(ctx, domain.Session{UserID: userId})
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return []domain.Session{}, nil
		}
		return []domain.Session{}, err
	}

	if err = cur.All(ctx, &sessions); err != nil {
		return []domain.Session{}, err
	}

	return sessions, nil
}

func (r *RepoSession) DeleteSessionById(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, domain.Session{Id: id})
	return err
}

func (r *RepoSession) DeleteSessionByToken(ctx context.Context, token uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, domain.Session{Session: token})
	return err
}
