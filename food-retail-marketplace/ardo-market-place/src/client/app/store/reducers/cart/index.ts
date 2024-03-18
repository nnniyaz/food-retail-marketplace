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
                cart: JSON.parse(localStorage.getItem('ardo-market-place-cart') || '[]')
            };
        case CartActionEnum.INCREMENT_TO_CART:
            const existingItemIndex = state.cart.findIndex((item) => item.id === action.payload.id);
            let incrementedCart: CartItem[] = [];
            if (existingItemIndex !== -1) {
                incrementedCart = state.cart.map((item) => {
                    if (item.id === action.payload.id) {
                        return {...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price};
                    }
                    return item;
                });
            } else {
                incrementedCart = [...state.cart, {...action.payload, quantity: 1, totalPrice: action.payload.price}];
            }
            localStorage.setItem('ardo-market-place-cart', JSON.stringify(incrementedCart));
            return {...state, cart: incrementedCart};
        case CartActionEnum.DECREMENT_FROM_CART:
            const decrementedCart = state.cart.map((item) => {
                if (item.id === action.payload) {
                    return {...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.price};
                }
                return item;
            }).filter((item) => item.quantity > 0);
            localStorage.setItem('ardo-market-place-cart', JSON.stringify(decrementedCart));
            return {...state, cart: decrementedCart};
        case CartActionEnum.REMOVE_FROM_CART:
            const updatedCart = state.cart.filter((item) => item.id !== action.payload);
            localStorage.setItem('ardo-market-place-cart', JSON.stringify(updatedCart));
            return {...state, cart: updatedCart};
        case CartActionEnum.CLEAR_CART:
            localStorage.setItem('ardo-market-place-cart', JSON.stringify([]));
            return {...state, cart: []};
        default:
            return state;
    }
}
