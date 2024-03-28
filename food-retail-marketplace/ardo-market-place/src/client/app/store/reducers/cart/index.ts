import {CartAction, CartActionEnum, CartState} from "@app/store/reducers/cart/types.ts";
import {CartItem} from "@domain/cartItem";
import {CountryCode} from "@pkg/formats/phone/countryCodes.ts";

const initialState: CartState = {
    cart: [] as CartItem[],
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
    orderNumber: "",
    isLoadingMakeOrder: false,
    validationErrors: {
        customerContacts: {
            phone: "",
            email: "",
            name: "",
        },
        deliveryInfo: {
            address: "",
        }
    },
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
        case CartActionEnum.SET_CUSTOMER_CONTACTS:
            return {...state, customerContacts: action.payload};
        case CartActionEnum.SET_DELIVERY_INFO:
            return {...state, deliveryInfo: action.payload};
        case CartActionEnum.MAKE_ORDER:
            localStorage.setItem('ardo-market-place-success-cart', JSON.stringify(state.cart));
            return {...state};
        case CartActionEnum.SET_ORDER_NUMBER:
            return {...state, orderNumber: action.payload};
        case CartActionEnum.SET_IS_LOADING_MAKE_ORDER:
            return {...state, isLoadingMakeOrder: action.payload};
        case CartActionEnum.SET_VALIDATION_ERRORS:
            return {...state, validationErrors: action.payload};
        default:
            return state;
    }
}
