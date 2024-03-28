import {CountryCode} from "@pkg/formats/phone/countryCodes.ts";

export type Cfg = {
    mode: "development" | "production";
    apiUri: string;
    assetsUri: string;
    defaultCountryCode: CountryCode;
}
