import {AppDispatch, RootState} from "@app/store";
import {OrderSettingsService} from "@pages/staff/OrderSettings/api/orderSettingsService";
import {OrderSettings} from "@entities/orderSettings/orderSettings";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {txt} from "@shared/core/i18ngen";
import {Notify} from "@shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    OrderSettingsActionEnum,
    SetOrderSettingsAction,
    SetIsLoadingGetOrderSettingsAction,
    SetIsLoadingUpdateMoqFeeAction
} from "@pages/staff/OrderSettings/store/orderSettings/types";

export const OrderSettingsActionCreator = {
    setOrderSettings: (payload: OrderSettings): SetOrderSettingsAction => ({
        type: OrderSettingsActionEnum.SET_ORDER_SETTINGS,
        payload
    }),
    setIsLoadingGetOrderSettings: (payload: boolean): SetIsLoadingGetOrderSettingsAction => ({
        type: OrderSettingsActionEnum.SET_IS_LOADING_GET_ORDER_SETTINGS,
        payload
    }),
    setIsLoadingUpdateMoqFee: (payload: boolean): SetIsLoadingUpdateMoqFeeAction => ({
        type: OrderSettingsActionEnum.SET_IS_LOADING_UPDATE_MOQ_FEE,
        payload
    }),

    getOrderSettings: (controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrderSettingsActionCreator.setIsLoadingGetOrderSettings(true));
            const res = await OrderSettingsService.getOrderSettings(controller);
            if (res.data.success) {
                dispatch(OrderSettingsActionCreator.setOrderSettings(res.data.data));
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(OrderSettingsActionCreator.setIsLoadingGetOrderSettings(false));
        }
    },

    updateOrderSettingsMoqFee: (fee: number, freeFrom: number, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrderSettingsActionCreator.setIsLoadingUpdateMoqFee(true));
            const res = await OrderSettingsService.updateOrderSettingsMoqFee({fee, freeFrom});
            if (res.data.success) {
                Notify.Success({title: txt.moq_fee_successfully_updated[currentLang], message: ""});
                await OrderSettingsActionCreator.getOrderSettings(new AbortController(), navigationCallback)(dispatch, getState);
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(OrderSettingsActionCreator.setIsLoadingUpdateMoqFee(false));
        }
    },
}
