import {MlString} from "@domain/base/mlString/mlString";

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
    return null;
}
