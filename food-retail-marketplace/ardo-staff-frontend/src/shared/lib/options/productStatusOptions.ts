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
