import {OrderAction, OrderActionEnum, OrderState} from "@pages/staff/Orders/store/order/types";

const initialState: OrderState = {
    orders: [],
    orderById: null,
    ordersCount: 0,
    isLoadingGetOrders: false
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
        default:
            return state;
    }
}
