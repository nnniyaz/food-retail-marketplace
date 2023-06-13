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

export type UsersData = {
    users: User[];
    usersCount: number;
}

export type UsersGetRequest = {
    limit: number;
    offset: number;
    search: string;
    isDeleted: boolean;
}
