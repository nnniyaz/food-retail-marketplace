import {AppDispatch, RootState} from "@app/store";
import {AddProductReq, EditProductCredentialsReq, ProductsService} from "@pages/staff/Products/api/productsService";
import {Product} from "@entities/product/product";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {txt} from "@shared/core/i18ngen";
import {back} from "@shared/lib/back/back";
import {Notify} from "@shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    ProductActionEnum,
    SetProductsAction,
    SetProductByIdAction,
    SetProductsCountAction,
    SetIsLoadingGetProductsAction,
    SetIsLoadingAddProductAction,
    SetIsLoadingGetProductByIdAction,
    SetIsLoadingEditProductAction,
    SetIsLoadingDeleteProductAction,
    SetIsLoadingRecoverProductAction,
} from "./types";

export const ProductsActionCreators = {
    setProducts: (payload: Product[]): SetProductsAction => ({type: ProductActionEnum.SET_PRODUCTS, payload}),
    setProductById: (payload: Product): SetProductByIdAction => ({type: ProductActionEnum.SET_PRODUCT_BY_ID, payload}),
    setProductsCount: (payload: number): SetProductsCountAction => ({type: ProductActionEnum.SET_PRODUCTS_COUNT, payload}),
    setIsLoadingGetProducts: (payload: boolean): SetIsLoadingGetProductsAction => ({type: ProductActionEnum.SET_IS_LOADING_GET_PRODUCTS, payload}),
    setIsLoadingAddProduct: (payload: boolean): SetIsLoadingAddProductAction => ({type: ProductActionEnum.SET_IS_LOADING_ADD_PRODUCT, payload}),
    setIsLoadingGetProductById: (payload: boolean): SetIsLoadingGetProductByIdAction => ({
        type: ProductActionEnum.SET_IS_LOADING_GET_PRODUCT_BY_ID,
        payload
    }),
    setIsLoadingEditProduct: (payload: boolean): SetIsLoadingEditProductAction => ({type: ProductActionEnum.SET_IS_LOADING_EDIT_PRODUCT, payload}),
    setIsLoadingDeleteProduct: (payload: boolean): SetIsLoadingDeleteProductAction => ({type: ProductActionEnum.SET_IS_LOADING_DELETE_PRODUCT, payload}),
    setIsLoadingRecoverProduct: (payload: boolean): SetIsLoadingRecoverProductAction => ({
        type: ProductActionEnum.SET_IS_LOADING_RECOVER_PRODUCT,
        payload
    }),

    fetchProducts: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(ProductsActionCreators.setIsLoadingGetProducts(true));
            const res = await ProductsService.getProducts(request, controller);
            if (res.data.success) {
                dispatch(ProductsActionCreators.setProducts(res.data.data.products));
                dispatch(ProductsActionCreators.setProductsCount(res.data.data.count));
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(ProductsActionCreators.setIsLoadingGetProducts(false));
        }
    },

    getProductById: (id: UUID, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(ProductsActionCreators.setIsLoadingGetProductById(true));
            const res = await ProductsService.getProductById(id, controller);
            if (res.data.success) {
                dispatch(ProductsActionCreators.setProductById(res.data.data));
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(ProductsActionCreators.setIsLoadingGetProductById(false));
        }
    },

    addProduct: (request: AddProductReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(ProductsActionCreators.setIsLoadingAddProduct(true));
            const res = await ProductsService.addProduct(request);
            if (res.data.success) {
                Notify.Success({title: txt.product_successfully_added[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(ProductsActionCreators.setIsLoadingAddProduct(false));
        }
    },

    editProductCredentials: (productId: UUID, request: EditProductCredentialsReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(ProductsActionCreators.setIsLoadingEditProduct(true));
            const res = await ProductsService.editProductCredentials(productId, request);
            if (res.data.success) {
                Notify.Success({title: txt.product_successfully_edited[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    back(navigationCallback?.to, navigationCallback?.navigate);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(ProductsActionCreators.setIsLoadingEditProduct(false));
        }
    },

    recoverProduct: (productId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(ProductsActionCreators.setIsLoadingRecoverProduct(true));
            const res = await ProductsService.recoverProduct(productId);
            if (res.data.success) {
                Notify.Success({title: txt.product_successfully_recovered[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(ProductsActionCreators.setIsLoadingRecoverProduct(false));
        }
    },

    deleteProduct: (productId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(ProductsActionCreators.setIsLoadingDeleteProduct(true));
            const res = await ProductsService.deleteProduct(productId);
            if (res.data.success) {
                Notify.Success({title: txt.product_successfully_deleted[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(ProductsActionCreators.setIsLoadingDeleteProduct(false));
        }
    },
}
