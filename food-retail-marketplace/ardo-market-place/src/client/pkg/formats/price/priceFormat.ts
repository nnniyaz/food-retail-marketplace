import {currencies} from "./currencies.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

export function priceFormat(price: number): string {
    const {currency} = useTypedSelector(state => state.systemState);
    if (isNaN(price)) {
        return "";
    }
    if (price < 0) {
        return "";
    }
    const priceRounded = price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
