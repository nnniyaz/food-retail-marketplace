import {AppDispatch, RootState} from "@app/store";
import {MlString} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";
import {OrderRequest} from "@domain/order/orderRequest.ts";
import {NavigateCallback} from "@domain/base/navigateCallback/navigateCallback.ts";
import {
    OrderCustomerContacts,
    OrderDeliveryInfo,
    OrderProduct,
    ValidateOrderCustomerContacts,
    ValidateOrderDeliveryInfo,
    ValidateOrderProduct
} from "@domain/order/order.ts";
import {Notify} from "@pkg/notification/notification.tsx";
import {translate} from "@pkg/translate/translate.ts";
import {CartServices} from "@services/cartServices.ts";
import {
    CartActionEnum,
    ClearCartAction,
    DecrementFromCartAction,
    IncrementToCartAction,
    InitCartStateAction,
    MakeOrderAction,
    RemoveFromCartAction,
    SetIsLoadingMakeOrderAction,
    SetOrderNumberAction,
    SetCustomerContactsAction,
    SetDeliveryInfoAction,
    SetOrderCommentAction,
} from "./types.ts";

export const CartActionCreator = {
    initCartState: (payload: {}): InitCartStateAction => ({
        type: CartActionEnum.INIT_CART_STATE,
        payload
    }),
    incrementToCart: (payload: { id: string, name: MlString, price: number }): IncrementToCartAction => ({
        type: CartActionEnum.INCREMENT_TO_CART,
        payload
    }),
    decrementFromCart: (payload: string): DecrementFromCartAction => ({
        type: CartActionEnum.DECREMENT_FROM_CART,
        payload
    }),
    removeFromCart: (payload: string): RemoveFromCartAction => ({
        type: CartActionEnum.REMOVE_FROM_CART, payload
    }),
    clearCart: (): ClearCartAction => ({
        type: CartActionEnum.CLEAR_CART
    }),
    setCustomerContacts: (payload: OrderCustomerContacts): SetCustomerContactsAction => ({
        type: CartActionEnum.SET_CUSTOMER_CONTACTS,
        payload
    }),
    setDeliveryInfo: (payload: OrderDeliveryInfo): SetDeliveryInfoAction => ({
        type: CartActionEnum.SET_DELIVERY_INFO,
        payload
    }),
    setOrderComment: (payload: string): SetOrderCommentAction => ({
        type: CartActionEnum.SET_ORDER_COMMENT,
        payload
    }),
    makeOrderAction: (): MakeOrderAction => ({
        type: CartActionEnum.MAKE_ORDER
    }),
    setOrderNumber: (payload: string): SetOrderNumberAction => ({
        type: CartActionEnum.SET_ORDER_NUMBER,
        payload
    }),
    setIsLoadingMakeOrder: (payload: boolean): SetIsLoadingMakeOrderAction => ({
        type: CartActionEnum.SET_IS_LOADING_MAKE_ORDER,
        payload
    }),

    makeOrder: (navigateCalback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            dispatch(CartActionCreator.setIsLoadingMakeOrder(true));
            const order: OrderRequest = {
                products: [],
                quantity: 0,
                totalPrice: 0,
                currency: Currency.HKD,
                customerContacts: {
                    name: "",
                    phone: "",
                    email: "",
                },
                deliveryInfo: {
                    address: "",
                    floor: "",
                    apartment: "",
                    deliveryComment: "",
                },
                orderComment: "",
            };

            let err: Error | null = null;
            getState().cartState.cart.forEach((item) => {
                const orderProduct: OrderProduct = {
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    pricePerUnit: item.price,
                    totalPrice: item.totalPrice,
                };
                err = ValidateOrderProduct(orderProduct);
                if (err !== null) {
                    throw err;
                }
                order.products.push(orderProduct);
                order.quantity += item.quantity;
                order.totalPrice += item.totalPrice;
            });

            err = ValidateOrderCustomerContacts(getState().cartState.customerContacts);
            if (err !== null) {
                throw err;
            }
            order.customerContacts = getState().cartState.customerContacts;

            err = ValidateOrderDeliveryInfo(getState().cartState.deliveryInfo);
            if (err !== null) {
                throw err;
            }
            order.deliveryInfo = getState().cartState.deliveryInfo;

            order.orderComment = getState().cartState.orderComment || "";

            const res = await CartServices.makeOrder(order);
            if (res.data.success) {
                dispatch(CartActionCreator.setOrderNumber(res.data.data.orderNumber));
                dispatch(CartActionCreator.makeOrderAction());
                dispatch(CartActionCreator.clearCart());
                Notify.Success({message: translate("order_success")});
                navigateCalback?.navigate(navigateCalback?.path);
            } else {
                res.data.messages.forEach((message: string) => {
                    Notify.Error({message: translate(message)});
                });
            }
        } catch (e) {
            console.log(e);
            Notify.Error({message: translate("failed_make_order")});
        } finally {
            dispatch(CartActionCreator.setIsLoadingMakeOrder(false));
        }
    }
}
