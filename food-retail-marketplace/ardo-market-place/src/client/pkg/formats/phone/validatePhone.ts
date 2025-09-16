import {CountryCode, countryCodesInfo} from "@pkg/formats/phone/countryCodes.ts";

export function validatePhone(phone: string, countryCode: CountryCode): boolean {
    switch (countryCode) {
        case CountryCode.HK:
            return `${countryCodesInfo[countryCode].dial_code}${phone}`.match(/^\+852\d{8}$/) !== null;
        case CountryCode.KZ:
            return `${countryCodesInfo[countryCode].dial_code}${phone}`.match(/^\+77\d{9}$/) !== null;
        default:
            return false;
    }
}
