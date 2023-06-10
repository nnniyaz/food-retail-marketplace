type UserFirstName = string;
type UserLastName = string;

export enum UserType {
    STAFF = "STAFF",
}

export type User = {
    id: UUID;
    firstName: UserFirstName;
    lastName: UserLastName;
    email: Email;
    userType: UserType;
    isDeleted: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
