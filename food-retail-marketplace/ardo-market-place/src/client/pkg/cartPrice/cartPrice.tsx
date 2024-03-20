import {CartItem} from "@domain/cartItem";

export const cartPrice = (cart: CartItem[]) => {
    let price: number = 0;
    cart.forEach((cartItem) => {
        price += cartItem.totalPrice;
    });
    return price;
}

export const cartTotalPrice = (cart: CartItem[]) => {
    let price: number = 0;
    cart.forEach((cartItem) => {
        price += cartItem.totalPrice;
    });
    return price;
}
