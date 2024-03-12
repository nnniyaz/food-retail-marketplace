import {Catalog} from "@entities/catalog/catalog";
import {CatalogActionEnum} from "./types";
import {AppDispatch, RootState} from "@app/store";
import {CatalogService} from "@pages/staff/Catalog/api/catalogService";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {Notify} from "@shared/lib/notification/notification";
import {txt} from "@shared/core/i18ngen";

export const CatalogActionCreators = {
    setCatalog: (payload: Catalog) => ({
        type: CatalogActionEnum.SET_CATALOG,
        payload
    }),
    setIsLoadingGetCatalog: (payload: boolean) => ({
        type: CatalogActionEnum.SET_IS_LOADING_GET_CATALOG,
        payload
    }),
    setIsLoadingEditCatalog: (payload: boolean) => ({
        type: CatalogActionEnum.SET_IS_LOADING_EDIT_CATALOG,
        payload
    }),
    setIsLoadingPublishCatalog: (payload: boolean) => ({
        type: CatalogActionEnum.SET_IS_LOADING_PUBLISH_CATALOG,
        payload
    }),

    fetchCatalogs: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CatalogActionCreators.setIsLoadingGetCatalog(true));
            const res = await CatalogService.getCatalogs(request, controller);
            if (res.data.success) {
                dispatch(CatalogActionCreators.setCatalog(res.data.data.catalogs?.[0] || null));
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
            dispatch(CatalogActionCreators.setIsLoadingGetCatalog(false));
        }
    },

    editCatalog: (request: Catalog, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CatalogActionCreators.setIsLoadingEditCatalog(true));
            const res = await CatalogService.editCatalog(request);
            if (res.data.success) {
                Notify.Success({title: txt.catalog_successfully_edited[currentLang], message: ""});
                await CatalogActionCreators.fetchCatalogs({offset: 0, limit: 0}, new AbortController(), navigationCallback)(dispatch, getState);
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
            });
        } finally {
            dispatch(CatalogActionCreators.setIsLoadingEditCatalog(false));
        }
    },

    publishCatalog: (navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CatalogActionCreators.setIsLoadingPublishCatalog(true));
            const res = await CatalogService.publishCatalog();
            if (res.data.success) {
                Notify.Success({title: txt.catalog_successfully_published[currentLang], message: ""});
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
            dispatch(CatalogActionCreators.setIsLoadingPublishCatalog(false));
        }
    },
}
