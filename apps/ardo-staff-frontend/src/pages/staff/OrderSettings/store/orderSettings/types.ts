import {OrderSettings} from "@entities/orderSettings/orderSettings";

export interface OrderSettingsState {
    orderSettings: OrderSettings;
    isLoadingGetOrderSettings: boolean;
    isLoadingUpdateMoqFee: boolean;
}

export enum OrderSettingsActionEnum {
    SET_ORDER_SETTINGS = "SET_ORDER_SETTINGS",
    SET_IS_LOADING_GET_ORDER_SETTINGS = "SET_IS_LOADING_GET_ORDER_SETTINGS",
    SET_IS_LOADING_UPDATE_MOQ_FEE = "SET_IS_LOADING_UPDATE_MOQ_FEE",
}

export interface SetOrderSettingsAction {
    type: OrderSettingsActionEnum.SET_ORDER_SETTINGS;
    payload: OrderSettings;
}

export interface SetIsLoadingGetOrderSettingsAction {
    type: OrderSettingsActionEnum.SET_IS_LOADING_GET_ORDER_SETTINGS;
    payload: boolean;
}

export interface SetIsLoadingUpdateMoqFeeAction {
    type: OrderSettingsActionEnum.SET_IS_LOADING_UPDATE_MOQ_FEE;
    payload: boolean;
}

export type OrderSettingsAction =
    SetOrderSettingsAction |
    SetIsLoadingGetOrderSettingsAction |
    SetIsLoadingUpdateMoqFeeAction;
