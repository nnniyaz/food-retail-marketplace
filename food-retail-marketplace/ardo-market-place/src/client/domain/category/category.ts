import {MlString, ValidateMlString} from "@domain/base/mlString/mlString";

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
    let err: Error | null = ValidateMlString(category.name);
    if (err !== null) {
        throw err;
    }
    err = ValidateMlString(category.desc);
    if (err !== null) {
        throw err;
    }
    if (typeof category.img !== "string") {
        throw new Error("Category's Img is invalid");
    }
    return null;
}
