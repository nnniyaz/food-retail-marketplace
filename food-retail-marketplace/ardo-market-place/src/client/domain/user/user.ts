import {Langs} from "@domain/base/mlString/mlString.ts";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    preferredLang: Langs;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
