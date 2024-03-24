import {Currency} from "@domain/base/currency/currency.ts";
import {OrderCustomerContacts, OrderProduct} from "@domain/order/order.ts";
import {DeliveryInfo} from "@domain/base/deliveryInfo/deliveryInfo.ts";

export type OrderRequest = {
    products: OrderProduct[];
    quantity: number;
    totalPrice: number;
    currency: Currency;
    customerContacts: OrderCustomerContacts;
    deliveryInfo: DeliveryInfo;
    orderComment: string;
}
