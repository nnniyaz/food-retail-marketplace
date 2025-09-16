import {OrderSettingsAction, OrderSettingsActionEnum, OrderSettingsState} from "@pages/staff/OrderSettings/store/orderSettings/types";

const initialState: OrderSettingsState = {
    orderSettings: {
        moq: {
            fee: 0,
            freeFrom: 0,
        }
    },
    isLoadingGetOrderSettings: false,
    isLoadingUpdateMoqFee: false,
};

export default function orderSettingsReducer(state = initialState, action: OrderSettingsAction): OrderSettingsState {
    switch (action.type) {
        case OrderSettingsActionEnum.SET_ORDER_SETTINGS:
            return {...state, orderSettings: action.payload};
        case OrderSettingsActionEnum.SET_IS_LOADING_GET_ORDER_SETTINGS:
            return {...state, isLoadingGetOrderSettings: action.payload};
        case OrderSettingsActionEnum.SET_IS_LOADING_UPDATE_MOQ_FEE:
            return {...state, isLoadingUpdateMoqFee: action.payload};
        default:
            return state;
    }
}
