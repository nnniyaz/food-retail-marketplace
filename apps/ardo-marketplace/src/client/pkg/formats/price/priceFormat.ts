import {currencies} from "./currencies.ts";
import {Currency} from "@domain/base/currency/currency.ts";

export function priceFormat(price: number, currency: Currency): string {
    if (isNaN(price)) {
        return "";
    }
    if (price < 0) {
        return "";
    }
    const priceRounded = Number.isInteger(price)
        ? price.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        : price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    const currencyData = currencies[currency];
    if (!currencyData) {
        return priceRounded.toString();
    }
    if (currencyData.on_left) {
        if (currencyData.joined) {
            return `${currencyData.symbol}${priceRounded}`;
        }
        return `${currencyData.symbol} ${priceRounded}`;
    } else {
        if (currencyData.joined) {
            return `${priceRounded}${currencyData.symbol}`;
        }
        return `${priceRounded} ${currencyData.symbol}`;
    }
}
