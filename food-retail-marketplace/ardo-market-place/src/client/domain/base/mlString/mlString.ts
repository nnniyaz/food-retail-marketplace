import lodash from 'lodash';

const {isEmpty} = lodash;

export enum Langs {
    key = 'key',
    RU = 'RU',
    EN = 'EN'
}

function ValidateLang(lang: string): Error | null {
    if (lang !== Langs.RU && lang !== Langs.EN) {
        return new Error("Lang is invalid");
    }
    return null;
}

export type MlString = Record<Langs, string>

export function ValidateMlString(mlString: MlString): Error | null {
    if (isEmpty(mlString)) {
        throw new Error("MlString is invalid");
    }
    Object.keys(mlString).forEach(lang => {
        let err = ValidateLang(lang);
        if (err !== null) {
            throw err;
        }
    });
    return null;
}
