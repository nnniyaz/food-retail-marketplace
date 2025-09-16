import {Langs} from "@entities/base/MlString";
import {Phone} from "@entities/base/phone";
import {DeliveryPoint} from "@entities/base/deliveryPoint";

export enum UserType {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    CLIENT = "CLIENT",
}

export type User = {
    id: UUID;
    code: string;
    firstName: string;
    lastName: string;
    email: Email;
    phone: Phone;
    deliveryPoints: DeliveryPoint[];
    lastDeliveryPoint: DeliveryPoint;
    userType: UserType;
    preferredLang: Langs;
    isDeleted: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    version: number;
}

export type UsersData = {
    users: User[];
    count: number;
}
