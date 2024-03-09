import {PublishedCatalog, PublishedCatalogCategories, PublishedCatalogSections} from "@domain/catalog/catalog.ts";

export interface CatalogState {
    catalog: PublishedCatalog | null;
    currentSection: string | null;
    currentCategory: string | null;
}

export enum CatalogActionEnum {
    INIT_CATALOG_STATE = "INIT_CATALOG_STATE",
    SET_CURRENT_SECTION = "SET_CURRENT_SECTION",
    SET_CURRENT_CATEGORY = "SET_CURRENT_CATEGORY"
}

export interface InitCatalogStateAction {
    type: CatalogActionEnum.INIT_CATALOG_STATE;
    payload: PublishedCatalog;
}

export interface SetCurrentSectionAction {
    type: CatalogActionEnum.SET_CURRENT_SECTION;
    payload: PublishedCatalogSections;
}

export interface SetCurrentCategoryAction {
    type: CatalogActionEnum.SET_CURRENT_CATEGORY;
    payload: PublishedCatalogCategories;
}

export type CatalogAction = InitCatalogStateAction | SetCurrentSectionAction | SetCurrentCategoryAction;
