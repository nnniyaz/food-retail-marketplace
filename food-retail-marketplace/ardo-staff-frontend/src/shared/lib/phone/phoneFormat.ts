import {CountryCodeEnum} from "@entities/base/phone";

export function phoneFormat(phone: string, countryCode: CountryCodeEnum): string {
    if (countryCode === CountryCodeEnum.HK) {
        return phone.replace(/(\d{4})(\d{4})/, "$1 $2");
    }
    else if (countryCode === CountryCodeEnum.KZ) {
        return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    } else {
        return phone;
    }
}
