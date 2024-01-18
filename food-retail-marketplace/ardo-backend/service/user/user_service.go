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
	GetById(ctx context.Context, userId string) (*user.User, error)
	GetByEmail(ctx context.Context, email string) (*user.User, error)
	Create(ctx context.Context, newUser *user.User) error
	UpdateCredentials(ctx context.Context, user *user.User, firstName, lastName string) error
	UpdateEmail(ctx context.Context, user *user.User, email string) error
	UpdatePreferredLang(ctx context.Context, user *user.User, preferredLang string) error
	UpdatePassword(ctx context.Context, user *user.User, password string) error
	Recover(ctx context.Context, userId string) error
	Delete(ctx context.Context, userId string) error
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

func (u *userService) GetById(ctx context.Context, userId string) (*user.User, error) {
	convertedId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	return u.userRepo.FindOneById(ctx, convertedId)
}

func (u *userService) GetByEmail(ctx context.Context, email string) (*user.User, error) {
	return u.userRepo.FindOneByEmail(ctx, email)
}

func (u *userService) Create(ctx context.Context, newUser *user.User) error {
	foundUser, err := u.userRepo.FindOneByEmail(ctx, newUser.GetEmail().String())
	if err != nil && err != exceptions.ErrUserNotFound {
		return err
	}
	if foundUser != nil && !foundUser.GetIsDeleted() {
		return exceptions.ErrUserAlreadyExist
	}
	return u.userRepo.Create(ctx, newUser)
}

func (u *userService) UpdateCredentials(ctx context.Context, user *user.User, firstName, lastName string) error {
	if user.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	err := user.UpdateCredentials(firstName, lastName)
	if err != nil {
		return err
	}
	return u.userRepo.Update(ctx, user)
}

func (u *userService) UpdateEmail(ctx context.Context, user *user.User, email string) error {
	if user.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	err := user.UpdateEmail(email)
	if err != nil {
		return err
	}
	return u.userRepo.Update(ctx, user)
}

func (u *userService) UpdatePreferredLang(ctx context.Context, user *user.User, preferredLang string) error {
	if user.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	err := user.UpdateLanguage(preferredLang)
	if err != nil {
		return err
	}
	return u.userRepo.Update(ctx, user)
}

func (u *userService) UpdatePassword(ctx context.Context, user *user.User, password string) error {
	if user.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	err := user.ChangePassword(password)
	if err != nil {
		return err
	}
	return u.userRepo.Update(ctx, user)
}

func (u *userService) Recover(ctx context.Context, userId string) error {
	foundUser, err := u.GetById(ctx, userId)
	if err != nil {
		return err
	}
	if !foundUser.GetIsDeleted() {
		return exceptions.ErrUserAlreadyExist
	}
	return u.userRepo.Recover(ctx, foundUser.GetId())
}

func (u *userService) Delete(ctx context.Context, userId string) error {
	foundUser, err := u.GetById(ctx, userId)
	if err != nil {
		return err
	}
	if foundUser.GetIsDeleted() {
		return exceptions.ErrUserNotFound
	}
	return u.userRepo.Delete(ctx, foundUser.GetId())
}
