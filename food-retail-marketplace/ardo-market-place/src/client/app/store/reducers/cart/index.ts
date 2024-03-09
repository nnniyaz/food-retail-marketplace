import {CartAction, CartActionEnum, CartState} from "@app/store/reducers/cart/types.ts";
import {CartItem} from "@domain/cartItem";

const initialState: CartState = {
    cart: [] as CartItem[],
};

export default function cartReducer(state = initialState, action: CartAction): CartState {
    switch (action.type) {
        case CartActionEnum.INIT_CART_STATE:
            return {...state, cart: action.payload};
        case CartActionEnum.ADD_TO_CART:
            return {...state, cart: [...state.cart, action.payload]};
        case CartActionEnum.REMOVE_FROM_CART:
            return {...state, cart: state.cart.filter((item) => item.id !== action.payload)};
        case CartActionEnum.CLEAR_CART:
            return {...state, cart: []};
        default:
            return state;
    }
}
