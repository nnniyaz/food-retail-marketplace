import {Catalog} from "@entities/catalog/catalog";
import {AppDispatch, RootState} from "@app/store";
import {CatalogService, EditCatalogReq} from "@pages/staff/Catalog/api/catalogService";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {txt} from "@shared/core/i18ngen";
import {Notify} from "@shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    CatalogActionEnum,
    SetCatalogAction,
    SetPublishedAtAction,
    SetIsLoadingEditCatalogAction,
    SetIsLoadingGetCatalogAction,
    SetIsLoadingPublishCatalogAction,
    SetIsLoadingGetPublishedAtAction
} from "./types";

export const CatalogActionCreators = {
    setCatalog: (payload: Catalog): SetCatalogAction => ({
        type: CatalogActionEnum.SET_CATALOG,
        payload
    }),
    setPublishedAt: (payload: Timestamp): SetPublishedAtAction => ({
        type: CatalogActionEnum.SET_PUBLISHED_AT,
        payload
    }),
    setIsLoadingGetCatalog: (payload: boolean): SetIsLoadingGetCatalogAction => ({
        type: CatalogActionEnum.SET_IS_LOADING_GET_CATALOG,
        payload
    }),
    setIsLoadingEditCatalog: (payload: boolean): SetIsLoadingEditCatalogAction => ({
        type: CatalogActionEnum.SET_IS_LOADING_EDIT_CATALOG,
        payload
    }),
    setIsLoadingPublishCatalog: (payload: boolean): SetIsLoadingPublishCatalogAction => ({
        type: CatalogActionEnum.SET_IS_LOADING_PUBLISH_CATALOG,
        payload
    }),
    setIsLoadingGetPublishedAt: (payload: boolean): SetIsLoadingGetPublishedAtAction => ({
        type: CatalogActionEnum.SET_IS_LOADING_GET_PUBLISHED_AT,
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

    editCatalog: (request: EditCatalogReq, catalogId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CatalogActionCreators.setIsLoadingEditCatalog(true));
            const res = await CatalogService.editCatalog(request, catalogId);
            if (res.data.success) {
                Notify.Success({title: txt.catalog_successfully_edited[currentLang], message: ""});
                await CatalogActionCreators.fetchCatalogs({
                    offset: 0,
                    limit: 0
                }, new AbortController(), navigationCallback)(dispatch, getState);
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

    publishCatalog: (catalogId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CatalogActionCreators.setIsLoadingPublishCatalog(true));
            const res = await CatalogService.publishCatalog(catalogId);
            if (res.data.success) {
                await CatalogActionCreators.getPublishTime(catalogId, new AbortController(), navigationCallback)(dispatch, getState);
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

    getPublishTime: (catalogId: UUID, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CatalogActionCreators.setIsLoadingGetPublishedAt(true));
            const res = await CatalogService.getPublishTime(catalogId, controller);
            if (res.data.success) {
                dispatch(CatalogActionCreators.setPublishedAt(res.data.data?.publishedAt));
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
            dispatch(CatalogActionCreators.setIsLoadingGetPublishedAt(false));
        }
    }
}
