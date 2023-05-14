package domain

import (
	"github.com/gofrs/uuid"
	"time"
)

type Session struct {
	Id        uuid.UUID `json:"id" bson:"_id"`
	UserID    uuid.UUID `json:"userId" bson:"userId"`
	Session   uuid.UUID `json:"session" bson:"session"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
}
