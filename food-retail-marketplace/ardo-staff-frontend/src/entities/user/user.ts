type UserFirstName = string;
type UserLastName = string;

export enum UserType {
    STAFF = "STAFF",
    MODERATOR = "MODERATOR",
    OWNER = "OWNER",
    MANAGER = "MANAGER",
}

export type User = {
    id: UUID;
    firstName: UserFirstName;
    lastName: UserLastName;
    email: Email;
    userType: UserType;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type UsersData = {
    users: User[];
    count: number;
}
