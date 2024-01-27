import {Lang} from "@entities/base/MlString";

type UserFirstName = string;
type UserLastName = string;

export enum UserType {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    CLIENT = "CLIENT",
}

export type User = {
    id: UUID;
    firstName: UserFirstName;
    lastName: UserLastName;
    email: Email;
    userType: UserType;
    preferredLang: Lang;
    isDeleted: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type UsersData = {
    users: User[];
    count: number;
}
