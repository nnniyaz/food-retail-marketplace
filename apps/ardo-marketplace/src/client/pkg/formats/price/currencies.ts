import {Currency} from "@domain/base/currency/currency.ts";

export const currencies: Record<Currency, { [key: string]: string | boolean }> = {
    [Currency.KZT]: {
        "symbol": "₸",
        "on_left": false,
        "joined": false
    },
    [Currency.HKD]: {
        "symbol": "HK$",
        "on_left": true,
        "joined": true
    },
}
