import {Langs} from "@domain/base/mlString/mlString.ts";
import {DeliveryInfo} from "@domain/base/deliveryInfo/deliveryInfo.ts";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deliveryPoints: DeliveryInfo[];
    lastDeliveryPoint: DeliveryInfo;
    userType: string;
    preferredLang: Langs;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
