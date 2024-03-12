import {isEmpty} from "lodash";

export enum Langs {
    KEY = "key",
    RU = "RU",
    EN = "EN",
}

export const ValidateLang = (lang: string): Error | null => {
    if (lang !== Langs.RU && lang !== Langs.EN) {
        return new Error(`Lang ${lang} is not valid`);
    }
    return null;
}

export type MlString = Record<Langs, string>

export const ValidateMlString = (mlString: MlString): Error | null => {
    if (isEmpty(mlString)) {
        return new Error("MlString is empty");
    }
    Object.keys(mlString).forEach((key) => {
        let err = ValidateLang(key);
        if (err !== null) {
            return err;
        }
    });
    return null;
}
