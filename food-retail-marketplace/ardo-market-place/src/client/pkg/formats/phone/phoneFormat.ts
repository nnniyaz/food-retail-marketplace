import {CountryCode} from "./countryCodes.ts";

export function phoneFormat(phone: string, countryCode: CountryCode): string {
    if (countryCode === CountryCode.HK) {
        return phone.replace(/(\d{4})(\d{4})/, "$1 $2");
    }
    else if (countryCode === CountryCode.KZ) {
        return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    } else {
        return phone;
    }
}
