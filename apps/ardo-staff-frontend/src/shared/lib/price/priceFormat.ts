import {Currency} from "@entities/base/currency";
import {currencies} from "@shared/lib/price/currencies";

export const priceFormat = (price: number, currencyCode: Currency) => {
    const currency = currencies[currencyCode];
    if (currency.on_left) {
        if (currency.joined) {
            return `${currency.symbol}${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        } else {
            return `${currency.symbol} ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        }
    } else {
        if (currency.joined) {
            return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${currency.symbol}`;
        } else {
            return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency.symbol}`;
        }
    }
}
