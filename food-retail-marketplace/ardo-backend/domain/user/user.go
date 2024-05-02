package user

import (
	"github/nnniyaz/ardo/domain/base/email"
	"github/nnniyaz/ardo/domain/base/lang"
	"github/nnniyaz/ardo/domain/base/phone"
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/user/exceptions"
	"github/nnniyaz/ardo/domain/user/valueobject"
	"time"
)

type User struct {
	id                uuid.UUID
	firstName         valueobject.FirstName
	lastName          valueobject.LastName
	email             email.Email
	phone             phone.Phone
	deliveryPoints    []valueobject.DeliveryPoint
	lastDeliveryPoint valueobject.DeliveryPoint
	password          valueobject.Password
	userType          valueobject.UserType
	preferredLang     lang.Lang
	isDeleted         bool
	createdAt         time.Time
	updatedAt         time.Time
	version           int
}

func NewUser(firstName, lastName, mail, phoneNumber, countryCode, password, userType, preferredLang, address, floor, apartment, deliveryComment string) (*User, error) {
	userId := uuid.NewUUID()

	userFirstName, err := valueobject.NewFirstName(firstName)
	if err != nil {
		return nil, err
	}

	userLastName, err := valueobject.NewLastName(lastName)
	if err != nil {
		return nil, err
	}

	userEmail, err := email.NewEmail(mail)
	if err != nil {
		return nil, err
	}

	userPhone, err := phone.NewPhone(phoneNumber, countryCode)
	if err != nil {
		return nil, err
	}

	userPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return nil, err
	}

	userUserType, err := valueobject.NewUserType(userType)
	if err != nil {
		return nil, err
	}

	userPreferredLang, err := lang.NewLang(preferredLang)
	if err != nil {
		return nil, err
	}

	deliveryPoint, err := valueobject.NewDeliveryPoint(address, floor, apartment, deliveryComment)
	if err != nil {
		return nil, err
	}

	return &User{
		id:                userId,
		firstName:         userFirstName,
		lastName:          userLastName,
		email:             userEmail,
		phone:             userPhone,
		deliveryPoints:    []valueobject.DeliveryPoint{deliveryPoint},
		lastDeliveryPoint: deliveryPoint,
		password:          userPassword,
		userType:          userUserType,
		preferredLang:     userPreferredLang,
		isDeleted:         false,
		createdAt:         time.Now(),
		updatedAt:         time.Now(),
		version:           1,
	}, nil
}

func (u *User) GetId() uuid.UUID {
	return u.id
}

func (u *User) GetFirstName() valueobject.FirstName {
	return u.firstName
}

func (u *User) GetLastName() valueobject.LastName {
	return u.lastName
}

func (u *User) GetEmail() email.Email {
	return u.email
}

func (u *User) GetPhone() phone.Phone {
	return u.phone
}

func (u *User) GetDeliveryPoints() []valueobject.DeliveryPoint {
	return u.deliveryPoints
}

func (u *User) GetLastDeliveryPoint() valueobject.DeliveryPoint {
	return u.lastDeliveryPoint
}

func (u *User) GetPassword() valueobject.Password {
	return u.password
}

func (u *User) GetUserType() valueobject.UserType {
	return u.userType
}

func (u *User) GetUserPreferredLang() lang.Lang {
	return u.preferredLang
}

func (u *User) GetIsDeleted() bool {
	return u.isDeleted
}

func (u *User) GetCreatedAt() time.Time {
	return u.createdAt
}

func (u *User) GetUpdatedAt() time.Time {
	return u.updatedAt
}

func (u *User) GetVersion() int {
	return u.version
}

func (u *User) UpdateCredentials(firstName, lastName string) error {
	userFirstName, err := valueobject.NewFirstName(firstName)
	if err != nil {
		return err
	}
	userLastName, err := valueobject.NewLastName(lastName)
	if err != nil {
		return err
	}
	u.firstName = userFirstName
	u.lastName = userLastName
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) UpdateEmail(mail string) error {
	userEmail, err := email.NewEmail(mail)
	if err != nil {
		return err
	}
	u.email = userEmail
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) UpdateLanguage(preferredLang string) error {
	userPreferredLang, err := lang.NewLang(preferredLang)
	if err != nil {
		return err
	}
	u.preferredLang = userPreferredLang
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) ComparePassword(password string) bool {
	return u.password.Compare(password)
}

func (u *User) ChangePassword(password string) error {
	if u.ComparePassword(password) {
		return exceptions.ErrSamePassword
	}
	newPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return err
	}
	u.password = newPassword
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) AddDeliveryPoint(address, floor, apartment, deliveryComment string) error {
	deliveryPoint, err := valueobject.NewDeliveryPoint(address, floor, apartment, deliveryComment)
	if err != nil {
		return err
	}
	u.deliveryPoints = append(u.deliveryPoints, deliveryPoint)
	u.lastDeliveryPoint = deliveryPoint
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) UpdateDeliveryPoint(deliveryPointId uuid.UUID, address, floor, apartment, deliveryComment string) error {
	for index, dp := range u.deliveryPoints {
		if dp.GetId().String() == deliveryPointId.String() {
			err := dp.Update(address, floor, apartment, deliveryComment)
			if err != nil {
				return err
			}
			u.lastDeliveryPoint = dp
			u.deliveryPoints[index] = dp
			break
		}
	}
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) DeleteDeliveryPoint(deliveryPointId uuid.UUID) error {
	for i, dp := range u.deliveryPoints {
		if dp.GetId() == deliveryPointId {
			u.deliveryPoints = append(u.deliveryPoints[:i], u.deliveryPoints[i+1:]...)
			if u.lastDeliveryPoint.GetId() == deliveryPointId {
				u.lastDeliveryPoint = u.deliveryPoints[len(u.deliveryPoints)-1]
			}
			break
		}
	}
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func (u *User) ChangeLastDeliveryPoint(deliveryPointId uuid.UUID) error {
	for _, dp := range u.deliveryPoints {
		if dp.GetId() == deliveryPointId {
			u.lastDeliveryPoint = dp
			break
		}
	}
	u.updatedAt = time.Now()
	u.version++
	return nil
}

func UnmarshalUserFromDatabase(id uuid.UUID, firstName, lastName, mail, phoneNumber, countryCode, userType, preferredLang string, deliveryPoints []valueobject.DeliveryPoint, lastDeliveryPoint valueobject.DeliveryPoint, password valueobject.Password, isDeleted bool, createdAt, updatedAt time.Time, version int) *User {
	phoneNum, _ := phone.NewPhone(phoneNumber, countryCode)
	return &User{
		id:                id,
		firstName:         valueobject.FirstName(firstName),
		lastName:          valueobject.LastName(lastName),
		email:             email.Email(mail),
		phone:             phoneNum,
		deliveryPoints:    deliveryPoints,
		lastDeliveryPoint: lastDeliveryPoint,
		password:          password,
		userType:          valueobject.UserType(userType),
		preferredLang:     lang.Lang(preferredLang),
		isDeleted:         isDeleted,
		createdAt:         createdAt,
		updatedAt:         updatedAt,
		version:           version,
	}
}
