import {AppDispatch, RootState} from "@app/store";
import {
    OrderHistoryActionEnum,
    SetIsLoadingAction,
    SetOrdersAction,
    SetOrdersCountAction
} from "@app/store/reducers/orderHistory/types.ts";
import {OrderService} from "@services/orderService.ts";
import {Order} from "@domain/order/order.ts";
import {Notify} from "@pkg/notification/notification.tsx";
import {txts} from "../../../../../server/pkg/core/txts.ts";

export const OrderHistoryActionCreator = {
    setOrders: (payload: Order[]): SetOrdersAction => ({
        type: OrderHistoryActionEnum.SET_ORDERS,
        payload
    }),
    setOrdersCount: (payload: number): SetOrdersCountAction => ({
        type: OrderHistoryActionEnum.SET_ORDERS_COUNT,
        payload
    }),
    setIsLoading: (payload: boolean): SetIsLoadingAction => ({
        type: OrderHistoryActionEnum.SET_IS_LOADING,
        payload
    }),
    fetchOrders: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang, cfg} = getState().systemState;
        const apiCfg = {baseURL: cfg.apiUri, lang: currentLang};
        try {
            dispatch(OrderHistoryActionCreator.setIsLoading(true));
            const res = await OrderService.getOrders(apiCfg);
            if (res.data.success) {
                dispatch(OrderHistoryActionCreator.setOrders(res.data.data.orders));
                dispatch(OrderHistoryActionCreator.setOrdersCount(res.data.data.count));
            }
        } catch (e: any) {
            Notify.Error({message: txts["failed_to_get_orders"][currentLang]});
        } finally {
            dispatch(OrderHistoryActionCreator.setIsLoading(false));
        }
    }
}
