import {AppDispatch, RootState} from "@app/store";
import {AddCategoryReq, CategoryService, EditCategoryReq} from "@pages/staff/Categories/api/categoryService";
import {Paginate} from "@entities/base/paginate";
import {Category} from "@entities/category/category";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    CategoryActionEnum,
    SetCategoriesAction,
    SetCategoryByIdAction,
    SetCategoriesCountAction,
    SetIsLoadingGetCategoriesAction,
    SetIsLoadingAddCategoryAction,
    SetIsLoadingGetCategoryByIdAction,
    SetIsLoadingEditCategoryAction,
    SetIsLoadingDeleteCategoryAction,
    SetIsLoadingRecoverCategoryAction
} from "./types";
import {txt} from "@shared/core/i18ngen";
import {Notify} from "@shared/lib/notification/notification";

export const CategoryActionCreators = {
    setCategories: (payload: Category[]): SetCategoriesAction => ({
        type: CategoryActionEnum.SET_CATEGORIES,
        payload
    }),
    setCategoryById: (payload: Category): SetCategoryByIdAction => ({
        type: CategoryActionEnum.SET_CATEGORY_BY_ID,
        payload
    }),
    setCategoriesCount: (payload: number): SetCategoriesCountAction => ({
        type: CategoryActionEnum.SET_CATEGORIES_COUNT,
        payload
    }),
    setIsLoadingGetCategories: (payload: boolean): SetIsLoadingGetCategoriesAction => ({
        type: CategoryActionEnum.SET_IS_LOADING_GET_CATEGORIES,
        payload
    }),
    setIsLoadingAddCategory: (payload: boolean): SetIsLoadingAddCategoryAction => ({
        type: CategoryActionEnum.SET_IS_LOADING_ADD_CATEGORY,
        payload
    }),
    setIsLoadingGetCategoryById: (payload: boolean): SetIsLoadingGetCategoryByIdAction => ({
        type: CategoryActionEnum.SET_IS_LOADING_GET_CATEGORY_BY_ID,
        payload
    }),
    setIsLoadingEditCategory: (payload: boolean): SetIsLoadingEditCategoryAction => ({
        type: CategoryActionEnum.SET_IS_LOADING_EDIT_CATEGORY,
        payload
    }),
    setIsLoadingDeleteCategory: (payload: boolean): SetIsLoadingDeleteCategoryAction => ({
        type: CategoryActionEnum.SET_IS_LOADING_DELETE_CATEGORY,
        payload
    }),
    setIsLoadingRecoverCategory: (payload: boolean): SetIsLoadingRecoverCategoryAction => ({
        type: CategoryActionEnum.SET_IS_LOADING_RECOVER_CATEGORY,
        payload
    }),

    fetchCategories: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CategoryActionCreators.setIsLoadingGetCategories(true));
            const res = await CategoryService.getCategories(request, controller);
            if (res.data.success) {
                dispatch(CategoryActionCreators.setCategories(res.data.data.categories));
                dispatch(CategoryActionCreators.setCategoriesCount(res.data.data.count));
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
            dispatch(CategoryActionCreators.setIsLoadingGetCategories(false));
        }
    },

    getCategoryById: (id: UUID, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CategoryActionCreators.setIsLoadingGetCategoryById(true));
            const res = await CategoryService.getCategoryById(id, controller);
            if (res.data.success) {
                dispatch(CategoryActionCreators.setCategoryById(res.data.data));
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
            dispatch(CategoryActionCreators.setIsLoadingGetCategoryById(false));
        }
    },

    addCategory: (request: AddCategoryReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CategoryActionCreators.setIsLoadingAddCategory(true));
            const res = await CategoryService.addCategory(request);
            if (res.data.success) {
                Notify.Success({title: txt.category_successfully_added[currentLang], message: ""});
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
            dispatch(CategoryActionCreators.setIsLoadingAddCategory(false));
        }
    },

    editCategory: (categoryId: string, request: EditCategoryReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CategoryActionCreators.setIsLoadingEditCategory(true));
            const res = await CategoryService.editCategory(categoryId, request);
            if (res.data.success) {
                Notify.Success({title: txt.category_successfully_edited[currentLang], message: ""});
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
            dispatch(CategoryActionCreators.setIsLoadingEditCategory(false));
        }
    },

    recoverCategory: (id: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CategoryActionCreators.setIsLoadingRecoverCategory(true));
            const res = await CategoryService.recoverCategory(id);
            if (res.data.success) {
                Notify.Success({title: txt.category_successfully_recovered[currentLang], message: ""});
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
            dispatch(CategoryActionCreators.setIsLoadingRecoverCategory(false));
        }
    },

    deleteCategory: (id: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(CategoryActionCreators.setIsLoadingDeleteCategory(true));
            const res = await CategoryService.deleteCategory(id);
            if (res.data.success) {
                Notify.Success({title: txt.category_successfully_deleted[currentLang], message: ""});
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
            dispatch(CategoryActionCreators.setIsLoadingDeleteCategory(false));
        }
    },
}
