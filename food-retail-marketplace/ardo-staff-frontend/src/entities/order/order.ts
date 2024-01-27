import {MlString} from "@entities/base/MlString";

export enum OrderStatus {
    NEW = "NEW",
    ACCEPTED = "ACCEPTED",
    CANCELED = "CANCELED",
    PENDING = "PENDING",
    DELIVERED = "DELIVERED",
}

export interface OrderProduct {
    productId: UUID,
    productName: MlString,
    quantity: number,
    totalPrice: number,
}

export interface CustomerContacts {
    productId: UUID,
    productName: MlString,
    quantity: number,
    totalPrice: number,
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
    products: OrderProduct[],
    quantity: number,
    totalPrice: number,
    customerContacts: CustomerContacts,
    deliveryInfo: DeliveryInfo,
    orderComment: string,
    status: OrderStatus,
    isDeleted: boolean,
    createdAt: Timestamp,
    updatedAt: Timestamp,
}

export interface OrdersData {
    orders: Order[],
    count: number,
}
