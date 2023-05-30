package base

import "github.com/google/uuid"

type UUID uuid.UUID

var Nil = UUID(uuid.Nil)

func NewUUID() UUID {
	return UUID(uuid.New())
}

func (id UUID) String() string {
	return uuid.UUID(id).String()
}

func UUIDFromString(id string) (UUID, error) {
	uuid, err := uuid.Parse(id)
	if err != nil {
		return Nil, err
	}
	return UUID(uuid), nil
}
