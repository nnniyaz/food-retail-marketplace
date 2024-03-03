import {MlString, ValidateMlString} from "@domain/base/mlString/mlString";

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
    ARCHIVED = 'ARCHIVED'
}

export function ValidateProduct(product: Product): boolean {
    if (!product._id) return false;
    if (!ValidateMlString(product.name)) return false;
    if (!ValidateMlString(product.desc)) return false;
    if (isNaN(product.price)) return false;
    if (isNaN(product.quantity)) return false;
    if (typeof product.img !== "string") return false;
    if (product.status !== ProductStatus.ACTIVE && product.status !== ProductStatus.ARCHIVED) return false;
    if (typeof product.isDeleted !== "boolean") return false;
    if (typeof product.createdAt !== "string") return false;
    if (typeof product.updatedAt !== "string") return false;
    if (isNaN(product.version)) return false;
    return true;
}
