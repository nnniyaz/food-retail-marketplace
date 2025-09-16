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

export const isEqualMlStrings = (mlString1: MlString, mlString2: MlString): boolean => {
    if (Object.keys(mlString1).length !== Object.keys(mlString2).length) {
        return false;
    }
    Object.keys(mlString1).forEach((key) => {
        if (mlString1[key as Langs] !== mlString2[key as Langs]) {
            return false;
        }
    });
    return true;
}

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
