package user

import (
	"context"
	"github.com/gofrs/uuid"
	"github/nnniyaz/ardo/domain"
	"github/nnniyaz/ardo/repo"
)

type UserService interface {
	GetAll(ctx context.Context) ([]domain.User, error)
	GetById(ctx context.Context, id uuid.UUID) (domain.User, error)
	Create(ctx context.Context, user domain.User) error
	Update(ctx context.Context, user domain.User) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type userService struct {
	repo *repo.Repository
}

func NewUserService(repo *repo.Repository) UserService {
	return &userService{repo: repo}
}

func (u *userService) GetAll(ctx context.Context) ([]domain.User, error) {

}

func (u *userService) GetById(ctx context.Context, id uuid.UUID) (domain.User, error) {

}

func (u *userService) Create(ctx context.Context, user domain.User) error {

}

func (u *userService) Update(ctx context.Context, user domain.User) error {

}

func (u *userService) Delete(ctx context.Context, id uuid.UUID) error {

}
