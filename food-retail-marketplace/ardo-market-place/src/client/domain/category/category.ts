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

export function ValidateCategory(category: Category): boolean {
    if (!category._id) return false;
    if (!ValidateMlString(category.name)) return false;
    if (!ValidateMlString(category.desc)) return false;
    if (typeof category.img !== "string") return false;
    if (typeof category.isDeleted !== "boolean") return false;
    if (typeof category.createdAt !== "string") return false;
    if (typeof category.updatedAt !== "string") return false;
    if (isNaN(category.version)) return false;
    return true;
}
