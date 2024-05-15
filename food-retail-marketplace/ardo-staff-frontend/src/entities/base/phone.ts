export enum CountryCodeEnum {
    KZ = "KZ",
    HK = "HK",
}

export const CountryCodes = {
    KZ: {
        name: "Kazakhstan",
        dialCode: "+7",
        code: "KZ",
    },
    HK: {
        name: "Hong Kong",
        dialCode: "+852",
        code: "HK",
    },
}

export interface Phone {
    countryCode: CountryCodeEnum,
    number: string,
}
