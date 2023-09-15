package user

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/domain/user/exceptions"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
)

type UserService interface {
	GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error)
	GetById(ctx context.Context, id string) (*user.User, error)
	GetByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, firstName, lastName, email, password, userType string) (*user.User, error)
	UpdateCredentials(ctx context.Context, userId, firstName, lastName, email string) error
	UpdatePassword(ctx context.Context, id, password string) error
	Delete(ctx context.Context, id string) error
}

type userService struct {
	userRepo repo.User
	logger   logger.Logger
}

func NewUserService(repo repo.User, l logger.Logger) UserService {
	return &userService{userRepo: repo, logger: l}
}

func (u *userService) GetByFilters(ctx context.Context, offset, limit int64, isDeleted bool) ([]*user.User, int64, error) {
	if offset < 0 {
		offset = 0
	}
	if limit < 0 {
		limit = 0
	}
	return u.userRepo.FindByFilters(ctx, offset, limit, isDeleted)
}

func (u *userService) GetById(ctx context.Context, id string) (*user.User, error) {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return nil, err
	}
	return u.userRepo.FindOneById(ctx, convertedId)
}

func (u *userService) GetByEmail(ctx context.Context, email string) (*user.User, error) {
	return u.userRepo.FindOneByEmail(ctx, email)
}

func (u *userService) Create(ctx context.Context, firstName, lastName, email, password, userType string) (*user.User, error) {
	foundUser, err := u.userRepo.FindOneByEmail(ctx, email)
	if err != nil && err != exceptions.ErrUserNotFound {
		return nil, err
	}
	if foundUser != nil && !foundUser.GetIsDeleted() {
		return nil, exceptions.ErrUserAlreadyExist
	}
	newUser, err := user.NewUser(firstName, lastName, email, password, userType)
	if err != nil {
		return nil, err
	}
	err = u.userRepo.Create(ctx, newUser)
	if err != nil {
		return nil, err
	}
	return newUser, nil
}

func (u *userService) UpdateCredentials(ctx context.Context, userId, firstName, lastName, email string) error {
	foundUser, err := u.GetById(ctx, userId)
	if err != nil {
		return err
	}
	if foundUser.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	err = foundUser.UpdateCredentials(firstName, lastName, email)
	if err != nil {
		return err
	}
	return u.userRepo.UpdateUserCredentials(ctx, foundUser.GetId(), foundUser.GetFirstName(), foundUser.GetLastName(), foundUser.GetEmail())
}

func (u *userService) UpdatePassword(ctx context.Context, id, password string) error {
	foundUser, err := u.GetById(ctx, id)
	if err != nil {
		return err
	}
	if foundUser.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	err = foundUser.ChangePassword(password)
	if err != nil {
		return err
	}
	return u.userRepo.UpdateUserPassword(ctx, foundUser.GetId(), foundUser.GetPassword())
}

func (u *userService) Delete(ctx context.Context, id string) error {
	foundUser, err := u.GetById(ctx, id)
	if err != nil {
		return err
	}
	if foundUser.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	return u.userRepo.Delete(ctx, foundUser.GetId())
}
