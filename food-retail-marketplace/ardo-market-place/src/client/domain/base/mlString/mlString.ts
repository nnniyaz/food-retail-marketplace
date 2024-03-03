import { isEmpty } from 'lodash';

export enum Langs {
    RU = 'RU',
    EN = 'EN'
}

function ValidateLang(lang: string): boolean {
    return (
        lang === Langs.RU ||
        lang === Langs.EN
    )
}

export type MlString = Record<Langs, string>

export function ValidateMlString(mlString: MlString): boolean {
    if (isEmpty(mlString)) {
        return false;
    }
    let count = 0;
    Object.keys(mlString).forEach(lang => {
        if (!ValidateLang(lang)) {
            count++;
        }
        if (!mlString[lang as Langs]) {
            count++;
        }
    });
    return count === Object.keys(mlString).length;
}
