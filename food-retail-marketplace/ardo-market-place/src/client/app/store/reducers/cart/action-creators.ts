import {
    InitCartStateAction,
    IncrementToCartAction,
    DecrementFromCartAction,
    RemoveFromCartAction,
    ClearCartAction,
    CartActionEnum,
} from "@app/store/reducers/cart/types.ts";
import {MlString} from "@domain/base/mlString/mlString.ts";

export const cartActionCreator = {
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
}
