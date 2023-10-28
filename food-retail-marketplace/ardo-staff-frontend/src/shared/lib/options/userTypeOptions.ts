import {UserType} from "@entities/user/user";
import {Lang} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";

export const userTypeTranslate = (userType: UserType | undefined, currentLang: Lang): string => {
    switch (userType) {
        case UserType.ADMIN:
            return txt.admin[currentLang];
        case UserType.DEVELOPER:
            return txt.developer[currentLang];
        case UserType.MODERATOR:
            return txt.moderator[currentLang];
        case UserType.MERCHANT:
            return txt.merchant[currentLang];
        case UserType.MANAGER:
            return txt.manager[currentLang];
        case UserType.CLIENT:
            return txt.client[currentLang];
        default:
            return txt.unknown[currentLang];
    }
}

export const userTypeOptions = [
    {value: UserType.ADMIN, label: UserType.ADMIN},
    {value: UserType.DEVELOPER, label: UserType.DEVELOPER},
    {value: UserType.MODERATOR, label: UserType.MODERATOR},
    {value: UserType.MERCHANT, label: UserType.MERCHANT},
    {value: UserType.MANAGER, label: UserType.MANAGER},
    {value: UserType.CLIENT, label: UserType.CLIENT},
];
