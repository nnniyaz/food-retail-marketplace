import {ProductAction, ProductActionEnum, ProductState} from "./types";

const initialState: ProductState = {
    products: [],
    productById: null,
    productsCount: 0,
    isLoadingGetProducts: false,
    isLoadingAddProduct: false,
    isLoadingGetProductById: false,
    isLoadingEditProduct: false,
    isLoadingDeleteProduct: false,
    isLoadingRecoverProduct: false,
    isLoadingProductImageUpload: false,
}

export default function productReducer(state = initialState, action: ProductAction): ProductState {
    switch (action.type) {
        case ProductActionEnum.SET_PRODUCTS:
            return {...state, products: action.payload}
        case ProductActionEnum.SET_PRODUCT_BY_ID:
            return {...state, productById: action.payload}
        case ProductActionEnum.SET_PRODUCTS_COUNT:
            return {...state, productsCount: action.payload}
        case ProductActionEnum.SET_IS_LOADING_GET_PRODUCTS:
            return {...state, isLoadingGetProducts: action.payload}
        case ProductActionEnum.SET_IS_LOADING_ADD_PRODUCT:
            return {...state, isLoadingAddProduct: action.payload}
        case ProductActionEnum.SET_IS_LOADING_GET_PRODUCT_BY_ID:
            return {...state, isLoadingGetProductById: action.payload}
        case ProductActionEnum.SET_IS_LOADING_EDIT_PRODUCT:
            return {...state, isLoadingEditProduct: action.payload}
        case ProductActionEnum.SET_IS_LOADING_RECOVER_PRODUCT:
            return {...state, isLoadingRecoverProduct: action.payload}
        case ProductActionEnum.SET_IS_LOADING_DELETE_PRODUCT:
            return {...state, isLoadingDeleteProduct: action.payload}
        case ProductActionEnum.SET_IS_LOADING_PRODUCT_IMAGE_UPLOAD:
            return {...state, isLoadingProductImageUpload: action.payload}
        default:
            return state;
    }
}
