import {MlString, ValidateMlString} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";

export type Order = {
    id: string;
    userId: string;
    number: string;
    products: OrderProduct[];
    quantity: number;
    totalPrice: number;
    currency: Currency.HKD;
    customerContacts: OrderCustomerContacts;
    deliveryInfo: OrderDeliveryInfo;
    orderComment: string;
    status: OrderStatus;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
}

export enum OrderStatus {
    NEW = "NEW",
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    CANCELED = "CANCELED",
    DELIVERED = "DELIVERED",
}

export type OrderProduct = {
    productId: string;
    productName: MlString;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
}

export function ValidateOrderProduct(product: OrderProduct): Error | null {
    if (product.productId === "") {
        return new Error("Cart item ID is empty");
    }
    let err = ValidateMlString(product.productName);
    if (err !== null) {
        return err;
    }
    if (isNaN(product.quantity)) {
        return new Error("Cart item quantity is not a number");
    }
    if (product.quantity <= 0) {
        return new Error("Cart item quantity is less than or equal to zero");
    }
    if (isNaN(product.pricePerUnit)) {
        return new Error("Cart item price per unit is not a number");
    }
    if (product.pricePerUnit <= 0) {
        return new Error("Cart item price per unit is less than or equal to zero");
    }
    if (isNaN(product.totalPrice)) {
        return new Error("Cart item total price is not a number");
    }
    if (product.totalPrice <= 0) {
        return new Error("Cart item total price is less than or equal to zero");
    }
    return null;
}

export type OrderCustomerContacts = {
    name: string;
    phone: string;
    email: string;
}

export function ValidateOrderCustomerContacts(contacts: OrderCustomerContacts): Error | null {
    if (contacts.name === "") {
        return new Error("Customer name is empty");
    }
    if (contacts.phone === "") {
        return new Error("Customer phone is empty");
    }
    if (contacts.email === "") {
        return new Error("Customer email is empty");
    }
    return null;
}

export type OrderDeliveryInfo = {
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

export function ValidateOrderDeliveryInfo(info: OrderDeliveryInfo): Error | null {
    if (info.address === "") {
        return new Error("Delivery address is empty");
    }
    return null;
}
