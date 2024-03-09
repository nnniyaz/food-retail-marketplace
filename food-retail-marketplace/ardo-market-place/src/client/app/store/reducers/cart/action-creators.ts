import {
    InitCartStateAction,
    AddToCartAction,
    RemoveFromCartAction,
    ClearCartAction,
    CartActionEnum
} from "@app/store/reducers/cart/types.ts";

export const cartActionCreator = {
    initCartState: (payload): InitCartStateAction => ({type: CartActionEnum.INIT_CART_STATE, payload}),
    addToCart: (payload): AddToCartAction => ({type: CartActionEnum.ADD_TO_CART, payload}),
    removeFromCart: (payload): RemoveFromCartAction => ({type: CartActionEnum.REMOVE_FROM_CART, payload}),
    clearCart: (): ClearCartAction => ({type: CartActionEnum.CLEAR_CART}),
}
