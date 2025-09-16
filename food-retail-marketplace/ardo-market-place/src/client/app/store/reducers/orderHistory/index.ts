import {OrderHistoryAction, OrderHistoryActionEnum, OrderHistoryState} from "@app/store/reducers/orderHistory/types.ts";

const initialState: OrderHistoryState = {
    orders: [],
    count: 0,
    isLoading: false,
};

export default function orderHistoryReducer(state = initialState, action: OrderHistoryAction): OrderHistoryState {
    switch (action.type) {
        case OrderHistoryActionEnum.SET_ORDERS:
            return {...state, orders: action.payload};
        case OrderHistoryActionEnum.SET_ORDERS_COUNT:
            return {...state, count: action.payload};
        case OrderHistoryActionEnum.SET_IS_LOADING:
            return {...state, isLoading: action.payload};
        default:
            return state;
    }
};
