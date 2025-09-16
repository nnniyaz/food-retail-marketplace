import {MlString} from "@entities/base/MlString";

export interface Category {
    id: string,
    name: MlString,
    desc: MlString,
    img: string,
    isDeleted: boolean,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    version: number,
}

export interface CategoriesData {
    categories: Category[],
    count: number,
}
