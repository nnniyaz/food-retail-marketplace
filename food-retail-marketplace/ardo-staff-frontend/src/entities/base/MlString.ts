export enum Lang {
    KEY = "key",
    RU = "RU",
    EN = "EN",
}

export type MlString = {[key in Lang]: string}

export const isMlStringValid = (mlString: MlString): boolean => {
    const keys: string[] = Object.keys(Lang);
    let valid: boolean = true;
    keys.forEach(key => {
        if (!(key in mlString)) {
            valid = false;
            return;
        }
    })
    return valid;
}
