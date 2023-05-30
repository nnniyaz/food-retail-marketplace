package session

import (
	"context"
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/domain/session"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
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

type mongoSession struct {
	id        base.UUID `bson:"_id"`
	userID    base.UUID `bson:"userID"`
	session   base.UUID `bson:"session"`
	createdAt time.Time `bson:"createdAt"`
}

func newFromSession(s *session.Session) *mongoSession {
	return &mongoSession{
		id:        s.GetId(),
		userID:    s.GetUserId(),
		session:   s.GetSession(),
		createdAt: s.GetCreatedAt(),
	}
}

func (r *RepoSession) CreateSession(ctx context.Context, session *session.Session) error {
	_, err := r.Coll().InsertOne(ctx, newFromSession(session))
	return err
}

func (r *RepoSession) GetSessionsByUserId(ctx context.Context, userId base.UUID) ([]*session.Session, error) {
	cur, err := r.Coll().Find(ctx, bson.D{{"userID", userId}})
	if err != nil {
		return nil, err
	}

	var sessions []*session.Session
	for cur.Next(ctx) {
		var s session.Session
		if err = cur.Decode(&s); err != nil {
			return nil, err
		}
		sessions = append(sessions, &s)
	}
	return sessions, nil
}

func (r *RepoSession) DeleteSessionById(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.D{{"_id", id}})
	return err
}

func (r *RepoSession) DeleteSessionByToken(ctx context.Context, token base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.D{{"session", token}})
	return err
}
