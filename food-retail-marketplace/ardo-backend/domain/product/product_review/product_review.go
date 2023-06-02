package product_review

import (
	"github/nnniyaz/ardo/domain/base"
	"github/nnniyaz/ardo/pkg/core"
	"time"
	"unicode/utf8"
)

var (
	ErrInvalidRating  = core.NewI18NError(core.EINVALID, core.TXT_INVALID_REVIEW_RATING)
	ErrCommentTooLong = core.NewI18NError(core.EINVALID, core.TXT_INVALID_REVIEW_COMMENT)
)

type ProductReview struct {
	id         base.UUID
	productId  base.UUID
	customerId base.UUID
	rating     int
	comment    string
	createdAt  time.Time
	updatedAt  time.Time
}

func NewProductReview(productId, customerId base.UUID, rating int, comment string) (*ProductReview, error) {
	if rating < 1 || rating > 5 {
		return nil, ErrInvalidRating
	}

	if utf8.RuneCountInString(comment) > 250 {
		return nil, ErrCommentTooLong
	}

	return &ProductReview{
		id:         base.NewUUID(),
		productId:  productId,
		customerId: customerId,
		rating:     rating,
		comment:    comment,
		createdAt:  time.Now(),
		updatedAt:  time.Now(),
	}, nil
}

func (p *ProductReview) GetId() base.UUID {
	return p.id
}

func (p *ProductReview) GetProductId() base.UUID {
	return p.productId
}

func (p *ProductReview) GetCustomerId() base.UUID {
	return p.customerId
}

func (p *ProductReview) GetRating() int {
	return p.rating
}

func (p *ProductReview) GetComment() string {
	return p.comment
}

func (p *ProductReview) GetCreatedAt() time.Time {
	return p.createdAt
}

func (p *ProductReview) GetUpdatedAt() time.Time {
	return p.updatedAt
}

func UnmarshalProductReviewFromDatabase(id, productId, customerId base.UUID, rating int, comment string, createdAt, updatedAt time.Time) (*ProductReview, error) {
	if rating < 1 || rating > 5 {
		return nil, ErrInvalidRating
	}

	if utf8.RuneCountInString(comment) > 250 {
		return nil, ErrCommentTooLong
	}

	return &ProductReview{
		id:         id,
		productId:  productId,
		customerId: customerId,
		rating:     rating,
		comment:    comment,
		createdAt:  createdAt,
		updatedAt:  updatedAt,
	}, nil
}
