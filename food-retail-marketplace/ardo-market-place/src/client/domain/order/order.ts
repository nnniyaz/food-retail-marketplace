import {Langs, MlString, ValidateMlString} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";
import {txts} from "../../../server/pkg/core/txts.ts";
import {DeliveryInfo} from "@domain/base/deliveryInfo/deliveryInfo.ts";

export type Order = {
    id: string;
    userId: string;
    number: string;
    products: OrderProduct[];
    quantity: number;
    totalPrice: number;
    currency: Currency.HKD;
    customerContacts: OrderCustomerContacts;
    deliveryInfo: DeliveryInfo;
    deliveryDate: string;
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
        return new Error(txts["cart_item_product_id_required"][Langs.EN]);
    }
    let err = ValidateMlString(product.productName);
    if (err !== null) {
        return err;
    }
    if (isNaN(product.quantity)) {
        return new Error(txts["cart_item_quantity_is_not_a_number"][Langs.EN]);
    }
    if (product.quantity <= 0) {
        return new Error(txts["cart_item_quantity_less_than_or_equal_to_zero"][Langs.EN]);
    }
    if (isNaN(product.pricePerUnit)) {
        return new Error(txts["cart_item_price_per_unit_is_not_a_number"][Langs.EN]);
    }
    if (product.pricePerUnit <= 0) {
        return new Error(txts["cart_item_price_per_unit_less_than_or_equal_to_zero"][Langs.EN]);
    }
    if (isNaN(product.totalPrice)) {
        return new Error(txts["cart_item_total_price_is_not_a_number"][Langs.EN]);
    }
    if (product.totalPrice <= 0) {
        return new Error(txts["cart_item_total_price_less_than_or_equal_to_zero"][Langs.EN]);
    }
    return null;
}

export type OrderCustomerContacts = {
    name: string;
    phone: string;
    email: string;
}
