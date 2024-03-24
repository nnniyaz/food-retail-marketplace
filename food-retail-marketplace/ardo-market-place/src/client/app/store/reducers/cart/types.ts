import {CartItem} from "@domain/cartItem";
import {MlString} from "@domain/base/mlString/mlString.ts";
import {OrderCustomerContacts} from "@domain/order/order.ts";
import {DeliveryInfo} from "@domain/base/deliveryInfo/deliveryInfo.ts";

export interface CartState {
    cart: CartItem[];
    customerContacts: OrderCustomerContacts;
    deliveryInfo: DeliveryInfo;
    orderNumber: string;
    validationErrors: {
        customerContacts: {
            phone: string;
            email: string;
            name: string;
        }
        deliveryInfo: {
            address: string;
        }
    }
    isLoadingMakeOrder: boolean;
}

export enum CartActionEnum {
    INIT_CART_STATE = "INIT_CART_STATE",

    INCREMENT_TO_CART = "INCREMENT_TO_CART",
    DECREMENT_FROM_CART = "DECREMENT_FROM_CART",
    REMOVE_FROM_CART = "REMOVE_FROM_CART",
    CLEAR_CART = "CLEAR_CART",

    SET_CUSTOMER_CONTACTS = "SET_CUSTOMER_CONTACTS",
    SET_DELIVERY_INFO = "SET_DELIVERY_INFO",

    MAKE_ORDER = "MAKE_ORDER",
    SET_ORDER_NUMBER = "SET_ORDER_NUMBER",
    SET_IS_LOADING_MAKE_ORDER = "SET_IS_LOADING_MAKE_ORDER",
    SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS",
}

export interface InitCartStateAction {
    type: CartActionEnum.INIT_CART_STATE;
    payload: {};
}

export interface IncrementToCartAction {
    type: CartActionEnum.INCREMENT_TO_CART;
    payload: {
        id: string;
        name: MlString;
        price: number;
    };
}

export interface DecrementFromCartAction {
    type: CartActionEnum.DECREMENT_FROM_CART;
    payload: string;
}

export interface RemoveFromCartAction {
    type: CartActionEnum.REMOVE_FROM_CART;
    payload: string;
}

export interface ClearCartAction {
    type: CartActionEnum.CLEAR_CART;
}

export interface SetCustomerContactsAction {
    type: CartActionEnum.SET_CUSTOMER_CONTACTS;
    payload: OrderCustomerContacts;
}

export interface SetDeliveryInfoAction {
    type: CartActionEnum.SET_DELIVERY_INFO;
    payload: DeliveryInfo;
}

export interface MakeOrderAction {
    type: CartActionEnum.MAKE_ORDER;
}

export interface SetOrderNumberAction {
    type: CartActionEnum.SET_ORDER_NUMBER;
    payload: string;
}

export interface SetIsLoadingMakeOrderAction {
    type: CartActionEnum.SET_IS_LOADING_MAKE_ORDER;
    payload: boolean;
}

export interface SetValidationErrorsAction {
    type: CartActionEnum.SET_VALIDATION_ERRORS;
    payload: {
        customerContacts: {
            phone: string;
            email: string;
            name: string;
        }
        deliveryInfo: {
            address: string;
        }
    }
}

export type CartAction =
    InitCartStateAction |
    IncrementToCartAction |
    DecrementFromCartAction |
    RemoveFromCartAction |
    ClearCartAction |
    SetCustomerContactsAction |
    SetDeliveryInfoAction |
    SetOrderNumberAction |
    MakeOrderAction |
    SetIsLoadingMakeOrderAction |
    SetValidationErrorsAction;
