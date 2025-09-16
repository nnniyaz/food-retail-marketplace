import {MlString} from "@entities/base/MlString";

export interface Slide {
    id: UUID;
    caption: MlString;
    img: string;
    isDeleted: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    version: number;
}

export interface SlidesData {
    slides: Slide[];
    count: number;
}
