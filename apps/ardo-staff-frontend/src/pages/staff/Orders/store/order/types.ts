import {Order} from "@entities/order/order";

export interface OrderState {
    orders: Order[];
    orderById: Order | null;
    ordersCount: number;
    isLoadingGetOrders: boolean;
    isLoadingGetOrderById: boolean;
    isLoadingAddOrder: boolean;
    isLoadingEditOrderStatus: boolean;
    isLoadingRecoverOrder: boolean;
    isLoadingDeleteOrder: boolean;
}

export enum OrderActionEnum {
    SET_ORDERS = "SET_ORDERS",
    SET_ORDER_BY_ID = "SET_ORDER_BY_ID",
    SET_ORDERS_COUNT = "SET_ORDERS_COUNT",
    SET_IS_LOADING_GET_ORDERS = "SET_IS_LOADING_GET_ORDERS",
    SET_IS_LOADING_GET_ORDER_BY_ID = "SET_IS_LOADING_GET_ORDER_BY_ID",
    SET_IS_LOADING_ADD_ORDER = "SET_IS_LOADING_ADD_ORDER",
    SET_IS_LOADING_EDIT_ORDER_STATUS = "SET_IS_LOADING_EDIT_ORDER_STATUS",
    SET_IS_LOADING_RECOVER_ORDER = "SET_IS_LOADING_RECOVER_ORDER",
    SET_IS_LOADING_DELETE_ORDER = "SET_IS_LOADING_DELETE_ORDER",
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

export interface SetIsLoadingGetOrderByIdAction {
    type: OrderActionEnum.SET_IS_LOADING_GET_ORDER_BY_ID;
    payload: boolean;
}

export interface SetIsLoadingAddOrderAction {
    type: OrderActionEnum.SET_IS_LOADING_ADD_ORDER;
    payload: boolean;
}

export interface SetIsLoadingEditOrderStatusAction {
    type: OrderActionEnum.SET_IS_LOADING_EDIT_ORDER_STATUS;
    payload: boolean;
}

export interface SetIsLoadingRecoverOrderAction {
    type: OrderActionEnum.SET_IS_LOADING_RECOVER_ORDER;
    payload: boolean;
}

export interface SetIsLoadingDeleteOrderAction {
    type: OrderActionEnum.SET_IS_LOADING_DELETE_ORDER;
    payload: boolean;
}

export type OrderAction =
    SetOrdersAction |
    SetOrderByIdAction |
    SetOrdersCountAction |
    SetIsLoadingGetOrdersAction |
    SetIsLoadingGetOrderByIdAction |
    SetIsLoadingAddOrderAction |
    SetIsLoadingEditOrderStatusAction |
    SetIsLoadingRecoverOrderAction |
    SetIsLoadingDeleteOrderAction;
