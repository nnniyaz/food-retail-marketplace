import {MlString, ValidateMlString} from "@domain/base/mlString/mlString";

export type Section = {
    "_id": string,
    "name": MlString,
    "img": string,
    "isDeleted": boolean,
    "createdAt": string,
    "updatedAt": string,
    "version": number
}

export function ValidateSection(section: Section): boolean {
    if (!section._id) return false;
    if (!ValidateMlString(section.name)) return false;
    if (typeof section.img !== "string") return false;
    if (typeof section.isDeleted !== "boolean") return false;
    if (typeof section.createdAt !== "string") return false;
    if (typeof section.updatedAt !== "string") return false;
    if (isNaN(section.version)) return false;
    return true;
}
