import {CartItem} from "@domain/cartItem";
import {MlString} from "@domain/base/mlString/mlString.ts";

export interface CartState {
    cart: CartItem[];
}

export enum CartActionEnum {
    INIT_CART_STATE = "INIT_CART_STATE",

    INCREMENT_TO_CART = "INCREMENT_TO_CART",
    DECREMENT_FROM_CART = "DECREMENT_FROM_CART",
    REMOVE_FROM_CART = "REMOVE_FROM_CART",
    CLEAR_CART = "CLEAR_CART",
}

export interface InitCartStateAction {
    type: CartActionEnum.INIT_CART_STATE;
    payload: {
        cart: CartItem[];
    };
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

export type CartAction =
    InitCartStateAction
    | IncrementToCartAction
    | DecrementFromCartAction
    | RemoveFromCartAction
    | ClearCartAction;
