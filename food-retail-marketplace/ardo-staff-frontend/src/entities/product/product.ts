import {MlString} from "@entities/base/MlString";

export enum ProductStatus {
    ACTIVE = "ACTIVE",
    ARCHIVE = "ARCHIVE",
}

export enum ProductUnit {
    PC = "pc",
    KG = "kg",
    LB = "lb",
}

export interface Product {
    id: UUID,
    name: MlString,
    desc: MlString,
    price: number,
    originalPrice: number,
    quantity: number,
    unit: ProductUnit,
    moq: number,
    cutOffTime: string,
    tags: string[],
    img: string,
    status: ProductStatus,
    isDeleted: boolean,
    createdAt: Timestamp,
    updatedAt: Timestamp,
}

export interface ProductsData {
    products: Product[],
    count: number,
}
