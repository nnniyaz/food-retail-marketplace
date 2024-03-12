import {Catalog} from "@entities/catalog/catalog";

export interface CatalogState {
    catalog: Catalog | null;
    isLoadingGetCatalog: boolean;
    isLoadingEditCatalog: boolean;
    isLoadingPublishCatalog: boolean;
}

export enum CatalogActionEnum {
    SET_CATALOG = "SET_CATALOG",
    SET_IS_LOADING_GET_CATALOG = "SET_IS_LOADING_GET_CATALOG",
    SET_IS_LOADING_EDIT_CATALOG = "SET_IS_LOADING_EDIT_CATALOG",
    SET_IS_LOADING_PUBLISH_CATALOG = "SET_IS_LOADING_PUBLISH_CATALOG",
}

export interface SetCatalogAction {
    type: CatalogActionEnum.SET_CATALOG;
    payload: Catalog;
}

export interface SetIsLoadingGetCatalogAction {
    type: CatalogActionEnum.SET_IS_LOADING_GET_CATALOG;
    payload: boolean;
}

export interface SetIsLoadingEditCatalogAction {
    type: CatalogActionEnum.SET_IS_LOADING_EDIT_CATALOG;
    payload: boolean;
}

export interface SetIsLoadingPublishCatalogAction {
    type: CatalogActionEnum.SET_IS_LOADING_PUBLISH_CATALOG;
    payload: boolean;
}

export type CatalogAction =
    SetCatalogAction |
    SetIsLoadingGetCatalogAction |
    SetIsLoadingEditCatalogAction |
    SetIsLoadingPublishCatalogAction;
