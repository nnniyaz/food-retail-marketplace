import {UserType} from "@entities/user/user";
import {Lang} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";

export const userTypeTranslate = (userType: UserType | undefined, currentLang: Lang): string => {
    switch (userType) {
        case UserType.STAFF:
            return txt.staff[currentLang];
        case UserType.MODERATOR:
            return txt.moderator[currentLang];
        case UserType.OWNER:
            return txt.owner[currentLang];
        case UserType.MANAGER:
            return txt.manager[currentLang];
        default:
            return txt.unknown[currentLang];
    }
}
