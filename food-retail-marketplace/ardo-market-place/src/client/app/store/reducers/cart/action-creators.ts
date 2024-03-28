import {AppDispatch, RootState} from "@app/store";
import {MlString} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";
import {DeliveryInfo} from "@domain/base/deliveryInfo/deliveryInfo.ts";
import {NavigateCallback} from "@domain/base/navigateCallback/navigateCallback.ts";
import {OrderRequest, ValidateOrderRequest} from "@domain/order/orderRequest.ts";
import {OrderCustomerContacts, OrderProduct, ValidateOrderProduct} from "@domain/order/order.ts";
import {Notify} from "@pkg/notification/notification.tsx";
import {CountryCode} from "@pkg/formats/phone/countryCodes.ts";
import {CartServices} from "@services/cartServices.ts";
import {
    CartActionEnum,
    ClearCartAction,
    DecrementFromCartAction,
    IncrementToCartAction,
    InitCartStateAction,
    MakeOrderAction,
    RemoveFromCartAction,
    SetCustomerContactsAction,
    SetDeliveryInfoAction,
    SetIsLoadingMakeOrderAction,
    SetOrderNumberAction,
    SetValidationErrorsAction,
} from "./types.ts";
import {txts} from "../../../../../server/pkg/core/txts.ts";

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
    setDeliveryInfo: (payload: DeliveryInfo): SetDeliveryInfoAction => ({
        type: CartActionEnum.SET_DELIVERY_INFO,
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
    setValidationErrors: (payload: {
        customerContacts: {
            phone: string;
            email: string;
            name: string;
        }
        deliveryInfo: {
            address: string;
        }
    }): SetValidationErrorsAction => ({
        type: CartActionEnum.SET_VALIDATION_ERRORS,
        payload
    }),

    makeOrder: (navigateCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang, cfg} = getState().systemState;
        const apiCfg = {baseURL: cfg.apiUri, lang: currentLang};
        try {
            dispatch(CartActionCreator.setIsLoadingMakeOrder(true));
            const order: OrderRequest = {
                products: [],
                quantity: 0,
                totalPrice: 0,
                currency: Currency.HKD,
                customerContacts: {
                    name: "",
                    phone: {
                        number: "",
                        countryCode: CountryCode.HK,
                    },
                    email: "",
                },
                deliveryInfo: {
                    address: "",
                    floor: "",
                    apartment: "",
                    deliveryComment: "",
                },
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
            order.customerContacts = getState().cartState.customerContacts;
            order.deliveryInfo = getState().cartState.deliveryInfo;

            err = ValidateOrderRequest(order);
            if (err !== null) {
                Notify.Error({message: err.message});
                return;
            }

            const res = await CartServices.makeOrder(apiCfg, order);
            if (res.data.success) {
                dispatch(CartActionCreator.setOrderNumber(res.data.data.orderNumber));
                dispatch(CartActionCreator.makeOrderAction());
                dispatch(CartActionCreator.clearCart());
                Notify.Success({message: txts["order_success"][currentLang]});
                navigateCallback?.navigate(navigateCallback?.path);
            } else {
                res.data.messages.forEach((message: string) => {
                    Notify.Error({message: txts[message][currentLang]});
                });
            }
        } catch (e) {
            console.log(e);
            Notify.Error({message: txts["failed_make_order"][currentLang]});
        } finally {
            dispatch(CartActionCreator.setIsLoadingMakeOrder(false));
        }
    }
}
