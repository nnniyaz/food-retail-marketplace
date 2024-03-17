import {Langs} from "@entities/base/MlString";

export enum UserType {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    CLIENT = "CLIENT",
}

export type User = {
    id: UUID;
    firstName: string;
    lastName: string;
    email: Email;
    userType: UserType;
    preferredLang: Langs;
    isDeleted: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type UsersData = {
    users: User[];
    count: number;
}
