import {Currency} from "@entities/base/currency";
import {Lang} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";

export const currencyTranslate = (currency: string | undefined, currentLang: Lang, fullName: boolean = false): string => {
    switch (currency) {
        case Currency.HKD:
            return fullName ? txt.hkd[currentLang] : "HKD";
        case Currency.USD:
            return fullName ? txt.usd[currentLang] : "USD";
        case Currency.KZT:
            return fullName ? txt.kzt[currentLang] : "EUR";
        default:
            return txt.unknown[currentLang];
    }
}
