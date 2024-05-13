import {Order} from "@entities/order/order";

export interface OrderState {
    orders: Order[];
    orderById: Order | null;
    ordersCount: number;
    isLoadingGetOrders: boolean;
}

export enum OrderActionEnum {
    SET_ORDERS = "SET_ORDERS",
    SET_ORDER_BY_ID = "SET_ORDER_BY_ID",
    SET_ORDERS_COUNT = "SET_ORDERS_COUNT",
    SET_IS_LOADING_GET_ORDERS = "SET_IS_LOADING_GET_ORDERS",
}

export interface SetOrdersAction {
    type: OrderActionEnum.SET_ORDERS;
    payload: Order[];
}

export interface SetOrderByIdAction {
    type: OrderActionEnum.SET_ORDER_BY_ID;
    payload: Order | null;
}

export interface SetOrdersCountAction {
    type: OrderActionEnum.SET_ORDERS_COUNT;
    payload: number;
}

export interface SetIsLoadingGetOrdersAction {
    type: OrderActionEnum.SET_IS_LOADING_GET_ORDERS;
    payload: boolean;
}

export type OrderAction = SetOrdersAction | SetOrderByIdAction | SetOrdersCountAction | SetIsLoadingGetOrdersAction;
