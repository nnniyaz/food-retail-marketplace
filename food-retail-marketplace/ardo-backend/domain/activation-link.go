package domain

import "github.com/gofrs/uuid"

type ActivationLink struct {
	Link        uuid.UUID `json:"link" bson:"link"`
	UserId      uuid.UUID `json:"userId" bson:"userId"`
	IsActivated bool      `json:"isActivated" bson:"isActivated"`
}
