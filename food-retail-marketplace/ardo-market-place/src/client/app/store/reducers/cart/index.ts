import {CartAction, CartActionEnum, CartState} from "@app/store/reducers/cart/types.ts";
import {CartItem} from "@domain/cartItem";

const initialState: CartState = {
    cart: [] as CartItem[],
};

export default function cartReducer(state = initialState, action: CartAction): CartState {
    switch (action.type) {
        case CartActionEnum.INIT_CART_STATE:
            return {
                ...state,
                cart: action.payload.cart,
            };
        case CartActionEnum.INCREMENT_TO_CART:
            const existingItemIndex = state.cart.findIndex((item) => item.id === action.payload.id);
            if (existingItemIndex !== -1) {
                const updatedCart = state.cart.map((item) => {
                    if (item.id === action.payload.id) {
                        return {...item, quantity: item.quantity + 1};
                    }
                    return item;
                });
                return {...state, cart: updatedCart};
            }
            return {
                ...state,
                cart: [...state.cart, {...action.payload, quantity: 1, totalPrice: action.payload.price}]
            };
        case CartActionEnum.DECREMENT_FROM_CART:
            const updatedCart = state.cart.map((item) => {
                if (item.id === action.payload) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            }).filter((item) => item.quantity > 0);
            return {...state, cart: updatedCart};
        case CartActionEnum.REMOVE_FROM_CART:
            return {...state, cart: state.cart.filter((item) => item.id !== action.payload)};
        case CartActionEnum.CLEAR_CART:
            return {...state, cart: []};
        default:
            return state;
    }
}
