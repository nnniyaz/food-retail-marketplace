import {Langs} from "@domain/base/mlString/mlString.ts";
import {Phone} from "@domain/base/phone/phone.ts";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: Phone;
    deliveryPoints: DeliveryPoint[];
    lastDeliveryPoint: DeliveryPoint;
    userType: string;
    preferredLang: Langs;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type DeliveryPoint = {
    id: string;
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}
