import {Product} from "@entities/product/product";

export interface ProductState {
    products: Product[];
    productById: Product | null;
    productsCount: number;
    isLoadingGetProducts: boolean;
    isLoadingAddProduct: boolean;
    isLoadingGetProductById: boolean;
    isLoadingEditProduct: boolean;
    isLoadingDeleteProduct: boolean;
    isLoadingRecoverProduct: boolean;
}

export enum ProductActionEnum {
    SET_PRODUCTS = "SET_PRODUCTS",
    SET_PRODUCT_BY_ID = "SET_PRODUCT_BY_ID",
    SET_PRODUCTS_COUNT = "SET_PRODUCTS_COUNT",
    SET_IS_LOADING_GET_PRODUCTS = "SET_IS_LOADING_GET_PRODUCTS",
    SET_IS_LOADING_GET_PRODUCT_BY_ID = "SET_IS_LOADING_GET_PRODUCT_BY_ID",
    SET_IS_LOADING_ADD_PRODUCT = "SET_IS_LOADING_ADD_PRODUCT",
    SET_IS_LOADING_EDIT_PRODUCT = "SET_IS_LOADING_EDIT_PRODUCT",
    SET_IS_LOADING_DELETE_PRODUCT = "SET_IS_LOADING_DELETE_PRODUCT",
    SET_IS_LOADING_RECOVER_PRODUCT = "SET_IS_LOADING_RECOVER_PRODUCT",
}

export interface SetProductsAction {
    type: ProductActionEnum.SET_PRODUCTS;
    payload: Product[];
}

export interface SetProductByIdAction {
    type: ProductActionEnum.SET_PRODUCT_BY_ID;
    payload: Product | null;
}

export interface SetProductsCountAction {
    type: ProductActionEnum.SET_PRODUCTS_COUNT;
    payload: number;
}

export interface SetIsLoadingGetProductsAction {
    type: ProductActionEnum.SET_IS_LOADING_GET_PRODUCTS;
    payload: boolean;
}

export interface SetIsLoadingAddProductAction {
    type: ProductActionEnum.SET_IS_LOADING_ADD_PRODUCT;
    payload: boolean;
}

export interface SetIsLoadingGetProductByIdAction {
    type: ProductActionEnum.SET_IS_LOADING_GET_PRODUCT_BY_ID;
    payload: boolean;
}

export interface SetIsLoadingEditProductAction {
    type: ProductActionEnum.SET_IS_LOADING_EDIT_PRODUCT;
    payload: boolean;
}

export interface SetIsLoadingDeleteProductAction {
    type: ProductActionEnum.SET_IS_LOADING_DELETE_PRODUCT;
    payload: boolean;
}

export interface SetIsLoadingRecoverProductAction {
    type: ProductActionEnum.SET_IS_LOADING_RECOVER_PRODUCT;
    payload: boolean;
}

export type ProductAction =
    SetProductsAction |
    SetProductByIdAction |
    SetProductsCountAction |
    SetIsLoadingGetProductsAction |
    SetIsLoadingAddProductAction |
    SetIsLoadingGetProductByIdAction |
    SetIsLoadingEditProductAction |
    SetIsLoadingDeleteProductAction |
    SetIsLoadingRecoverProductAction;
