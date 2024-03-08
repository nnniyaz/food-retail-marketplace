export enum Currency {
    HKD = "HKD",
    KZT = "KZT",
}

export function ValidateCurrency(currency: string): Error | null {
    if (currency !== Currency.HKD && currency !== Currency.KZT) {
        return new Error("Invalid currency");
    }
    return null;
}
