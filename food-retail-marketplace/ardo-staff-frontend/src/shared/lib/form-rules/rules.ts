import {FormInstance, FormRule} from "antd";
import {LangsList} from "entities/base/MlString";
import {txt} from "shared/core/i18ngen";

interface IRules {
    required: (message: string) => FormRule,
    email: (message: string) => FormRule,
    minmaxLen: (message: string, min: number, max: number) => FormRule,
    matchPass: (form: FormInstance, lang: LangsList) => FormRule,
}

export const rules: IRules = {
    required: (message: string) => ({required: true, message: message}),
    email: (message: string) => ({type: 'email', message: message}),
    minmaxLen: (message: string, min: number, max: number) => ({
        validator(_: any, value: string) {
            if (!value) {
                return Promise.resolve();
            }
            else if (value.length < min || value.length > max) {
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
}
