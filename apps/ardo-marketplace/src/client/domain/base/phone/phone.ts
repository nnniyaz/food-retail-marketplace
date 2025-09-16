import {CountryCode} from "@pkg/formats/phone/countryCodes.ts";

export type Phone = {
    number: string;
    countryCode: CountryCode;
}
