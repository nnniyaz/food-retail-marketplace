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

export function ValidateSection(section: Section): Error | null {
    if (!section._id) {
        throw new Error("Section's Id is invalid");
    }
    let err: Error | null = ValidateMlString(section.name);
    if (err !== null) {
        throw err;
    }
    if (typeof section.img !== "string") {
        throw new Error("Section's Img is invalid");
    }
    return null;
}
