import {Catalog} from "@entities/catalog/catalog";

export interface CatalogState {
    catalog: Catalog | null;
    publishedAt: Timestamp | null;
    isLoadingGetCatalog: boolean;
    isLoadingEditCatalog: boolean;
    isLoadingPublishCatalog: boolean;
    isLoadingGetPublishedAt: boolean;
}

export enum CatalogActionEnum {
    SET_CATALOG = "SET_CATALOG",
    SET_PUBLISHED_AT = "SET_PUBLISHED_AT",
    SET_IS_LOADING_GET_CATALOG = "SET_IS_LOADING_GET_CATALOG",
    SET_IS_LOADING_EDIT_CATALOG = "SET_IS_LOADING_EDIT_CATALOG",
    SET_IS_LOADING_PUBLISH_CATALOG = "SET_IS_LOADING_PUBLISH_CATALOG",
    SET_IS_LOADING_GET_PUBLISHED_AT = "SET_IS_LOADING_GET_PUBLISHED_AT",
}

export interface SetCatalogAction {
    type: CatalogActionEnum.SET_CATALOG;
    payload: Catalog;
}

export interface SetPublishedAtAction {
    type: CatalogActionEnum.SET_PUBLISHED_AT;
    payload: Timestamp;
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

export interface SetIsLoadingGetPublishedAtAction {
    type: CatalogActionEnum.SET_IS_LOADING_GET_PUBLISHED_AT;
    payload: boolean;
}

export type CatalogAction =
    SetCatalogAction |
    SetPublishedAtAction |
    SetIsLoadingGetCatalogAction |
    SetIsLoadingEditCatalogAction |
    SetIsLoadingPublishCatalogAction |
    SetIsLoadingGetPublishedAtAction;
