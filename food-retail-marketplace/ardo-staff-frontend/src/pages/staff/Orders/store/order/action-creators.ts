import {AppDispatch, RootState} from "@app/store";
import {Order} from "@entities/order/order";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {
    OrderActionEnum,
    SetIsLoadingGetOrdersAction,
    SetOrderByIdAction,
    SetOrdersAction,
    SetOrdersCountAction
} from "@pages/staff/Orders/store/order/types";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {OrdersService} from "@pages/staff/Orders/api/ordersService";

export const OrdersActionCreators = {
    setOrders: (payload: Order[]): SetOrdersAction => ({type: OrderActionEnum.SET_ORDERS, payload}),
    setOrderById: (payload: Order | null): SetOrderByIdAction => ({type: OrderActionEnum.SET_ORDER_BY_ID, payload}),
    setOrdersCount: (payload: number): SetOrdersCountAction => ({type: OrderActionEnum.SET_ORDERS_COUNT, payload}),
    setIsLoadingGetOrders: (payload: boolean): SetIsLoadingGetOrdersAction => ({type: OrderActionEnum.SET_IS_LOADING_GET_ORDERS, payload}),

    fetchOrders: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrdersActionCreators.setIsLoadingGetOrders(true));
            const res = await OrdersService.getOrders(request, controller);
            if (res.data.success) {
                dispatch(OrdersActionCreators.setOrders(res.data.data.orders));
                dispatch(OrdersActionCreators.setOrdersCount(res.data.data.count));
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
            dispatch(OrdersActionCreators.setIsLoadingGetOrders(false));
        }
    },
}
