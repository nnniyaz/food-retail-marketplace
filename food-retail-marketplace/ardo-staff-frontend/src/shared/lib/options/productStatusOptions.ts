import {Lang} from "@entities/base/MlString";
import {ProductStatus} from "@entities/product/product";
import {txt} from "@shared/core/i18ngen";

export const productStatusTranslate = (productStatus: ProductStatus, currentLang: Lang): string => {
    switch (productStatus) {
        case ProductStatus.ACTIVE:
            return txt.active[currentLang];
        case ProductStatus.ARCHIVE:
            return txt.archive[currentLang];
        default:
            return txt.unknown[currentLang];
    }
}

export const productStatusOptions = (currentLang: Lang = Lang.EN) => ([
    {value: ProductStatus.ACTIVE, label: txt.active[currentLang]},
    {value: ProductStatus.ARCHIVE, label: txt.archive[currentLang]},
]);
