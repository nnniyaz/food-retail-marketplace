import {CartItem} from "@domain/cartItem";

export interface CartState {
    cart: CartItem[];
}

export enum CartActionEnum {
    INIT_CART_STATE = "INIT_CART_STATE",

    ADD_TO_CART = "ADD_TO_CART",
    REMOVE_FROM_CART = "REMOVE_FROM_CART",
    CLEAR_CART = "CLEAR_CART",
}

export interface InitCartStateAction {
    type: CartActionEnum.INIT_CART_STATE;
    payload: CartItem[];
}

export interface AddToCartAction {
    type: CartActionEnum.ADD_TO_CART;
    payload: CartItem;
}

export interface RemoveFromCartAction {
    type: CartActionEnum.REMOVE_FROM_CART;
    payload: string;
}

export interface ClearCartAction {
    type: CartActionEnum.CLEAR_CART;
}

export type CartAction = InitCartStateAction | AddToCartAction | RemoveFromCartAction | ClearCartAction;
