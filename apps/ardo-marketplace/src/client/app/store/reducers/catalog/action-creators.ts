import {
    CatalogActionEnum,
    InitCatalogStateAction,
    SetCurrentCategoryAction,
    SetCurrentSectionAction
} from "@app/store/reducers/catalog/types.ts";
import {PublishedCatalog, PublishedCatalogCategories, PublishedCatalogSections} from "@domain/catalog/catalog.ts";

export const CatalogActionCreator = {
    initCatalogState: (catalog: PublishedCatalog): InitCatalogStateAction => {
        return {
            type: CatalogActionEnum.INIT_CATALOG_STATE,
            payload: catalog
        }
    },
    setCurrentSection: (section: PublishedCatalogSections): SetCurrentSectionAction => {
        return {
            type: CatalogActionEnum.SET_CURRENT_SECTION,
            payload: section
        }
    },
    setCurrentCategory: (category: PublishedCatalogCategories): SetCurrentCategoryAction => {
        return {
            type: CatalogActionEnum.SET_CURRENT_CATEGORY,
            payload: category
        }
    }
}
