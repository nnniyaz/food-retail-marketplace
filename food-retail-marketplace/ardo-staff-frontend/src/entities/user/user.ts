import {Lang} from "@entities/base/MlString";

type UserFirstName = string;
type UserLastName = string;

export enum UserType {
    ADMIN = "ADMIN",
    // DEVELOPER = "DEVELOPER",
    MODERATOR = "MODERATOR",
    // MERCHANT = "MERCHANT",
    // MANAGER = "MANAGER",
    CLIENT = "CLIENT",
}

export type User = {
    id: UUID;
    firstName: UserFirstName;
    lastName: UserLastName;
    email: Email;
    userType: UserType;
    preferredLang: Lang;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isDeleted: boolean;
}

export type UsersData = {
    users: User[];
    count: number;
}
