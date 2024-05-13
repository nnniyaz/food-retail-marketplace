import {MlString} from "@entities/base/MlString";
import {Currency} from "@entities/base/currency";
import {Phone} from "@entities/base/phone";

export enum OrderStatus {
    ORDER_HAS_BEEN_PLACED = "ORDER_HAS_BEEN_PLACED",
    ORDER_CONFIRMED = "ORDER_CONFIRMED",
    FINAL_INVOICE_SENT = "FINAL_INVOICE_SENT",
    GOODS_DELIVERED = "GOODS_DELIVERED",
    PAID = "PAID",
}

export interface OrderProduct {
    productId: UUID,
    productName: MlString,
    quantity: number,
    pricePerUnit: number,
    totalPrice: number,
}

export interface CustomerContacts {
    name: string,
    phone: Phone,
    email: string,
}

export interface DeliveryInfo {
    address: string,
    floor: string,
    apartment: string,
    deliveryComment: string,
}

export interface Order {
    id: UUID,
    userId: UUID,
    number: string,
    products: OrderProduct[],
    quantity: number,
    totalPrice: number,
    currency: Currency,
    customerContacts: CustomerContacts,
    deliveryInfo: DeliveryInfo,
    status: OrderStatus,
    isDeleted: boolean,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    version: number,
}

export interface OrdersData {
    orders: Order[],
    count: number,
}
