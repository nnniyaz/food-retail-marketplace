import {Currency} from "@domain/base/currency/currency.ts";
import {DeliveryInfo} from "@domain/base/deliveryInfo/deliveryInfo.ts";
import {OrderCustomerContacts, OrderProduct} from "@domain/order/order.ts";
import {txts} from "../../../server/pkg/core/txts.ts";
import {Langs} from "@domain/base/mlString/mlString.ts";

export type OrderRequest = {
    products: OrderProduct[];
    quantity: number;
    totalPrice: number;
    currency: Currency;
    customerContacts: OrderCustomerContacts;
    deliveryInfo: DeliveryInfo;
}

export function ValidateOrderRequest(orderRequest: OrderRequest): Error | null {
    if (!orderRequest.customerContacts?.name) {
        return new Error(txts["order_name_required"][Langs.EN]);
    }
    if (!orderRequest.customerContacts?.phone) {
        return new Error(txts["order_phone_required"][Langs.EN]);
    }
    if (!orderRequest.customerContacts?.email) {
        return new Error(txts["order_email_required"][Langs.EN]);
    }
    if (!orderRequest.deliveryInfo?.address) {
        return new Error(txts["order_delivery_address_required"][Langs.EN]);
    }
    if (!Array.isArray(orderRequest.products)) {
        return new Error(txts["order_products_is_not_array"][Langs.EN]);
    }
    if (!orderRequest.products.length) {
        return new Error(txts["no_products_in_order"][Langs.EN]);
    }
    if (!orderRequest.quantity) {
        return new Error(txts["order_invalid_quantity"][Langs.EN]);
    }
    if (!orderRequest.totalPrice) {
        return new Error(txts["order_invalid_price"][Langs.EN]);
    }
    const productTotalQuantity = orderRequest.products.reduce((acc, product) => acc + product.quantity, 0);
    if (productTotalQuantity !== orderRequest.quantity) {
        return new Error(txts["order_products_number_not_equal_to_quantity"][Langs.EN]);
    }
    let totalPrice: number = 0;
    orderRequest.products.forEach(product => {
        if (product.pricePerUnit * product.quantity !== product.totalPrice) {
            return new Error(txts["order_invalid_product_total_price"][Langs.EN]);
        }
        totalPrice += product.totalPrice;
    });
    if (totalPrice !== orderRequest.totalPrice) {
        return new Error(txts["order_invalid_total_price"][Langs.EN]);
    }
    return null;
}
