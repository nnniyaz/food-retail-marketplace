import {MlString} from "@domain/base/mlString/mlString";

export type Category = {
    "_id": string,
    "name": MlString,
    "desc": MlString,
    "img": string,
    "isDeleted": boolean,
    "createdAt": string,
    "updatedAt": string,
    "version": number
}

export function ValidateCategory(category: Category): Error | null {
    if (!category._id) {
        throw new Error("Category's Id is invalid");
    }
    return null;
}
