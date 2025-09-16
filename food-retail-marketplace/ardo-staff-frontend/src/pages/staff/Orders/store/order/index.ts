import {OrderAction, OrderActionEnum, OrderState} from "@pages/staff/Orders/store/order/types";

const initialState: OrderState = {
    orders: [],
    orderById: null,
    ordersCount: 0,
    isLoadingGetOrders: false,
    isLoadingGetOrderById: false,
    isLoadingAddOrder: false,
    isLoadingEditOrderStatus: false,
    isLoadingRecoverOrder: false,
    isLoadingDeleteOrder: false,
};

export default function orderReducer(state = initialState, action: OrderAction): OrderState {
    switch (action.type) {
        case OrderActionEnum.SET_ORDERS:
            return {...state, orders: action.payload}
        case OrderActionEnum.SET_ORDER_BY_ID:
            return {...state, orderById: action.payload}
        case OrderActionEnum.SET_ORDERS_COUNT:
            return {...state, ordersCount: action.payload}
        case OrderActionEnum.SET_IS_LOADING_GET_ORDERS:
            return {...state, isLoadingGetOrders: action.payload}
        case OrderActionEnum.SET_IS_LOADING_GET_ORDER_BY_ID:
            return {...state, isLoadingGetOrderById: action.payload}
        case OrderActionEnum.SET_IS_LOADING_ADD_ORDER:
            return {...state, isLoadingAddOrder: action.payload}
        case OrderActionEnum.SET_IS_LOADING_EDIT_ORDER_STATUS:
            return {...state, isLoadingEditOrderStatus: action.payload}
        case OrderActionEnum.SET_IS_LOADING_RECOVER_ORDER:
            return {...state, isLoadingRecoverOrder: action.payload}
        case OrderActionEnum.SET_IS_LOADING_DELETE_ORDER:
            return {...state, isLoadingDeleteOrder: action.payload}
        default:
            return state;
    }
}
