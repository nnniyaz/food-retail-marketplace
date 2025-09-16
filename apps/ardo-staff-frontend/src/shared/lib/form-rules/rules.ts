import {FormInstance, FormRule} from "antd";
import {Langs, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {CountryCodeEnum, CountryCodes, Phone} from "@entities/base/phone";

interface IRules {
    required: (message: string) => FormRule,
    requiredI18n: (message: string) => FormRule,
    email: (message: string) => FormRule,
    minmaxLen: (message: string, min: number, max: number) => FormRule,
    matchPass: (form: FormInstance, lang: Langs) => FormRule,
    phone: (form: FormInstance, lang: Langs) => FormRule,
}

export const rules: IRules = {
    required: (message: string) => ({required: true, message: message}),
    requiredI18n: (message: string) => ({
        validator(_: any, value: MlString) {
            let countEmpties = 0;
            Object.values(value).forEach((val) => {
                if (!val) {
                    countEmpties++;
                }
            });
            if (countEmpties === Object.values(value).length) {
                return Promise.reject(message);
            }
            return Promise.resolve();
        }
    }),
    email: (message: string) => ({type: 'email', message: message}),
    minmaxLen: (message: string, min: number, max: number) => ({
        validator(_: any, value: string) {
            if (!value) {
                return Promise.resolve();
            } else if (value.length < min || value.length > max) {
                return Promise.reject(message);
            }
            return Promise.resolve();
        }
    }),
    matchPass: (form, lang) => ({
        validator(_, value) {
            if (!value || form.getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(txt.password_does_not_match[lang]));
        },
    }),
    phone: (form: FormInstance, lang: Langs) => ({
        validator(_: any, value: string) {
            const phone = form.getFieldValue('phone') as Phone;
            if (!phone.number) {
                return Promise.resolve();
            }

            switch (phone.countryCode) {
                case CountryCodeEnum.KZ:
                    if (phone.number.length !== 10) {
                        return Promise.reject(txt.phone_invalid_format[lang]);
                    }
                    if (`${CountryCodes[phone.countryCode].dialCode}${phone.number}`.match(/^\+77\d{9}$/) === null) {
                        return Promise.reject(txt.phone_invalid_format[lang]);
                    }
                    break;
                case CountryCodeEnum.HK:
                    if (phone.number.length !== 8) {
                        return Promise.reject(txt.phone_invalid_format[lang]);
                    }
                    if (`${CountryCodes[phone.countryCode].dialCode}${phone.number}`.match(/^\+852\d{8}$/) === null) {
                        return Promise.reject(txt.phone_invalid_format[lang]);
                    }
                    break;
            }

            return Promise.resolve();
        }
    }),
}
