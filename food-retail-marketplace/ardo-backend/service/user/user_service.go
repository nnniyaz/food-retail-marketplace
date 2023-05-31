package user

import (
	"context"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user"
	"github/nnniyaz/ardo/pkg/core"
	"github/nnniyaz/ardo/repo"
	"strconv"
)

var (
	ErrUserNotFound = core.NewI18NError(core.ENOTFOUND, core.TXT_USER_NOT_FOUND)
)

type UserService interface {
	GetAll(ctx context.Context) ([]*user.User, error)
	GetByFilters(ctx context.Context, offset, limit, isDeleted string) ([]*user.User, error)
	GetById(ctx context.Context, id string) (*user.User, error)
	GetByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, firstName, lastName, email, password, userType string) (*user.User, error)
	UpdateCredentials(ctx context.Context, userId, firstName, lastName, email string) error
	UpdatePassword(ctx context.Context, id, password string) error
	Delete(ctx context.Context, id string) error
}

type userService struct {
	userRepo repo.User
}

func NewUserService(repo repo.User) UserService {
	return &userService{userRepo: repo}
}

func (u *userService) GetAll(ctx context.Context) ([]*user.User, error) {
	return u.userRepo.Find(ctx)
}

func (u *userService) GetByFilters(ctx context.Context, offset, limit, isDeleted string) ([]*user.User, error) {
	convertedOffset, err := strconv.Atoi(offset)
	if err != nil {
		return nil, err
	}
	convertedLimit, err := strconv.Atoi(limit)
	if err != nil {
		return nil, err
	}
	convertedIsDeleted, err := strconv.ParseBool(isDeleted)
	if err != nil {
		return nil, err
	}
	return u.userRepo.FindByFilters(ctx, int64(convertedOffset), int64(convertedLimit), convertedIsDeleted)
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
	err = foundUser.UpdateCredentials(firstName, lastName, email)
	if err != nil {
		return err
	}
	return u.userRepo.Update(ctx, foundUser)
}

func (u *userService) UpdatePassword(ctx context.Context, id, password string) error {
	foundUser, err := u.GetById(ctx, id)
	if err != nil {
		return err
	}
	err = foundUser.ChangePassword(password)
	if err != nil {
		return err
	}
	return u.userRepo.Update(ctx, foundUser)
}

func (u *userService) Delete(ctx context.Context, id string) error {
	foundUser, err := u.GetById(ctx, id)
	if err != nil {
		return err
	}
	if foundUser.GetIsDeleted() {
		return ErrUserNotFound
	}
	return u.userRepo.Delete(ctx, foundUser.GetId())
}
