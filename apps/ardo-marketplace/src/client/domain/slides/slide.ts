import {MlString} from "@domain/base/mlString/mlString.ts";

export type Slide = {
    "_id": string,
    "caption": MlString,
    "img": string,
    "isDeleted": boolean,
    "createdAt": Date,
    "updatedAt": Date,
    "version": number
}

export function ValidateSlide(slide: Slide): Error | null {
    if (!slide._id) {
        throw new Error("Slide's Id is invalid");
    }
    if (typeof slide.img !== "string") {
        throw new Error("Slide's Img is invalid");
    }
    return null;
}
