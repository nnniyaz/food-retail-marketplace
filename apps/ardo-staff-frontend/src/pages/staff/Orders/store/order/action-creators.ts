import {AppDispatch, RootState} from "@app/store";
import {Order} from "@entities/order/order";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {
    OrderActionEnum,
    SetIsLoadingGetOrdersAction,
    SetOrderByIdAction,
    SetOrdersAction,
    SetOrdersCountAction,
    SetIsLoadingGetOrderByIdAction,
    SetIsLoadingAddOrderAction,
    SetIsLoadingEditOrderStatusAction,
    SetIsLoadingRecoverOrderAction,
    SetIsLoadingDeleteOrderAction,
} from "@pages/staff/Orders/store/order/types";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {AddOrderReq, EditOrderStatusReq, OrdersService} from "@pages/staff/Orders/api/ordersService";
import {Notify} from "@shared/lib/notification/notification";
import {txt} from "@shared/core/i18ngen";

export const OrdersActionCreators = {
    setOrders: (payload: Order[]): SetOrdersAction => ({type: OrderActionEnum.SET_ORDERS, payload}),
    setOrderById: (payload: Order | null): SetOrderByIdAction => ({type: OrderActionEnum.SET_ORDER_BY_ID, payload}),
    setOrdersCount: (payload: number): SetOrdersCountAction => ({type: OrderActionEnum.SET_ORDERS_COUNT, payload}),
    setIsLoadingGetOrders: (payload: boolean): SetIsLoadingGetOrdersAction => ({type: OrderActionEnum.SET_IS_LOADING_GET_ORDERS, payload}),
    setIsLoadingGetOrderById: (payload: boolean): SetIsLoadingGetOrderByIdAction => ({type: OrderActionEnum.SET_IS_LOADING_GET_ORDER_BY_ID, payload}),
    setIsLoadingAddOrder: (payload: boolean): SetIsLoadingAddOrderAction => ({type: OrderActionEnum.SET_IS_LOADING_ADD_ORDER, payload}),
    setIsLoadingEditOrderStatus: (payload: boolean): SetIsLoadingEditOrderStatusAction => ({type: OrderActionEnum.SET_IS_LOADING_EDIT_ORDER_STATUS, payload}),
    setIsLoadingRecoverOrder: (payload: boolean): SetIsLoadingRecoverOrderAction => ({type: OrderActionEnum.SET_IS_LOADING_RECOVER_ORDER, payload}),
    setIsLoadingDeleteOrder: (payload: boolean): SetIsLoadingDeleteOrderAction => ({type: OrderActionEnum.SET_IS_LOADING_DELETE_ORDER, payload}),

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

    getOrderById: (orderId: string, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrdersActionCreators.setIsLoadingGetOrderById(true));
            const res = await OrdersService.getOrderById(orderId, controller);
            if (res.data.success) {
                dispatch(OrdersActionCreators.setOrderById(res.data.data));
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
            dispatch(OrdersActionCreators.setIsLoadingGetOrderById(false));
        }
    },

    addOrder: (request: AddOrderReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrdersActionCreators.setIsLoadingAddOrder(true));
            const res = await OrdersService.addOrder(request);
            if (res.data.success) {
                Notify.Success({title: txt.order_successfully_added[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
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
            dispatch(OrdersActionCreators.setIsLoadingAddOrder(false));
        }
    },

    updateOrderStatus: (orderId: string, request: EditOrderStatusReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrdersActionCreators.setIsLoadingEditOrderStatus(true));
            const res = await OrdersService.updateOrderStatus(orderId, request);
            if (res.data.success) {
                Notify.Success({title: txt.order_status_successfully_edited[currentLang], message: ""});
                await OrdersActionCreators.getOrderById(orderId, new AbortController(), navigationCallback)(dispatch, getState);
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
            dispatch(OrdersActionCreators.setIsLoadingEditOrderStatus(false));
        }
    },

    recoverOrder: (orderId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrdersActionCreators.setIsLoadingRecoverOrder(true));
            const res = await OrdersService.recoverOrder(orderId);
            if (res.data.success) {
                Notify.Success({title: txt.order_successfully_recovered[currentLang], message: ""});
                await OrdersActionCreators.getOrderById(orderId, new AbortController(), navigationCallback)(dispatch, getState);
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
            dispatch(OrdersActionCreators.setIsLoadingRecoverOrder(false));
        }
    },

    deleteOrder: (orderId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrdersActionCreators.setIsLoadingRecoverOrder(true));
            const res = await OrdersService.deleteOrder(orderId);
            if (res.data.success) {
                Notify.Success({title: txt.order_successfully_deleted[currentLang], message: ""});
                await OrdersActionCreators.getOrderById(orderId, new AbortController(), navigationCallback)(dispatch, getState);
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
            dispatch(OrdersActionCreators.setIsLoadingRecoverOrder(false));
        }
    },
}
