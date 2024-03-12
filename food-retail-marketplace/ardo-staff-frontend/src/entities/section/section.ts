import {MlString} from "@entities/base/MlString";

export interface Section {
    id: string,
    name: MlString,
    img: string,
    isDeleted: boolean,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    version: number,
}

export interface SectionsData {
    sections: Section[],
    count: number,
}
