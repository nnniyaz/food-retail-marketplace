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
	client *mongo.Client
}

func NewRepoSession(client *mongo.Client) *RepoSession {
	return &RepoSession{client: client}
}

func (r *RepoSession) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("sessions")
}

type mongoSession struct {
	Id           base.UUID `bson:"_id"`
	UserID       base.UUID `bson:"userID"`
	Session      base.UUID `bson:"session"`
	UserAgent    string    `bson:"userAgent"`
	LastActionAt time.Time `bson:"lastActionAt"`
	CreatedAt    time.Time `bson:"createdAt"`
}

func newFromSession(s *session.Session) *mongoSession {
	return &mongoSession{
		Id:           s.GetId(),
		UserID:       s.GetUserId(),
		Session:      s.GetSession(),
		UserAgent:    s.GetUserAgent().String(),
		LastActionAt: s.GetLastActionAt(),
		CreatedAt:    s.GetCreatedAt(),
	}
}

func (m *mongoSession) ToAggregate() (*session.Session, error) {
	return session.UnmarshalSessionFromDatabase(m.Id, m.UserID, m.Session, m.UserAgent, m.CreatedAt)
}

func (r *RepoSession) FindManyByUserId(ctx context.Context, userId base.UUID) ([]*session.Session, error) {
	cur, err := r.Coll().Find(ctx, bson.M{"userID": userId})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	defer cur.Close(ctx)

	var sessions []*session.Session
	for cur.Next(ctx) {
		var s mongoSession
		if err = cur.Decode(&s); err != nil {
			return nil, err
		}
		ag, err := s.ToAggregate()
		if err != nil {
			return nil, err
		}
		sessions = append(sessions, ag)
	}
	return sessions, nil
}

func (r *RepoSession) FindOneBySession(ctx context.Context, session base.UUID) (*session.Session, error) {
	var s mongoSession
	if err := r.Coll().FindOne(ctx, bson.M{"session": session}).Decode(&s); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	ag, err := s.ToAggregate()
	if err != nil {
		return nil, err
	}
	return ag, nil
}

func (r *RepoSession) Create(ctx context.Context, session *session.Session) error {
	_, err := r.Coll().InsertOne(ctx, newFromSession(session))
	return err
}

func (r *RepoSession) UpdateLastActionAt(ctx context.Context, sessionId base.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": sessionId,
	}, bson.M{
		"$set": bson.M{
			"lastActionAt": time.Now(),
		},
	})
	return err
}

func (r *RepoSession) DeleteAllByUserId(ctx context.Context, userId base.UUID) error {
	_, err := r.Coll().DeleteMany(ctx, bson.M{"userID": userId})
	return err
}

func (r *RepoSession) DeleteById(ctx context.Context, id base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *RepoSession) DeleteByToken(ctx context.Context, token base.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"session": token})
	return err
}
