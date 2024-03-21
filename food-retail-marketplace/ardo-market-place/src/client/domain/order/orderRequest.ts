import {Currency} from "@domain/base/currency/currency.ts";
import {OrderCustomerContacts, OrderDeliveryInfo, OrderProduct} from "@domain/order/order.ts";

export type OrderRequest = {
    products: OrderProduct[];
    quantity: number;
    totalPrice: number;
    currency: Currency;
    customerContacts: OrderCustomerContacts;
    deliveryInfo: OrderDeliveryInfo;
    orderComment: string;
}
