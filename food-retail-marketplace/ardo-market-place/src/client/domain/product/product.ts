import {MlString} from "@domain/base/mlString/mlString";

export type Product = {
    "_id": string,
    "name": MlString,
    "desc": MlString,
    "price": number,
    "quantity": number,
    "img": string,
    "status": ProductStatus,
    "isDeleted": boolean,
    "createdAt": string,
    "updatedAt": string,
    "version": number
}

export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVE = 'ARCHIVE'
}

export function ValidateProduct(product: Product): Error | null {
    if (!product._id) {
        throw new Error("Product's Id is invalid");
    }
    if (isNaN(product.price)) {
        throw new Error("Product's Price is invalid");
    }
    if (isNaN(product.quantity)) {
        throw new Error("Product's Quantity is invalid");
    }
    if (product.status !== ProductStatus.ACTIVE && product.status !== ProductStatus.ARCHIVE) {
        throw new Error("Product's Status is invalid");
    }
    return null;
}
