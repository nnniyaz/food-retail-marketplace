import {Order} from "@domain/order/order.ts";

export interface OrderHistoryState {
    orders: Order[];
    count: number;
    isLoading: boolean;
}

export enum OrderHistoryActionEnum {
    SET_ORDERS = "SET_ORDERS",
    SET_ORDERS_COUNT = "SET_ORDERS_COUNT",
    SET_IS_LOADING = "SET_IS_LOADING",
}

export interface SetOrdersAction {
    type: OrderHistoryActionEnum.SET_ORDERS;
    payload: Order[];
}

export interface SetOrdersCountAction {
    type: OrderHistoryActionEnum.SET_ORDERS_COUNT;
    payload: number;
}

export interface SetIsLoadingAction {
    type: OrderHistoryActionEnum.SET_IS_LOADING;
    payload: boolean;
}

export type OrderHistoryAction = SetOrdersAction | SetOrdersCountAction | SetIsLoadingAction;
