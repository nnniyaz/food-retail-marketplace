import {Category} from "@entities/category/category";

export interface CategoryState {
    categories: Category[];
    categoryById: Category | null;
    categoriesCount: number;
    isLoadingGetCategories: boolean;
    isLoadingAddCategory: boolean;
    isLoadingGetCategoryById: boolean;
    isLoadingEditCategory: boolean;
    isLoadingDeleteCategory: boolean;
    isLoadingRecoverCategory: boolean;
}

export enum CategoryActionEnum {
    SET_CATEGORIES = "SET_CATEGORIES",
    SET_CATEGORY_BY_ID = "SET_CATEGORY_BY_ID",
    SET_CATEGORIES_COUNT = "SET_CATEGORIES_COUNT",
    SET_IS_LOADING_GET_CATEGORIES = "SET_IS_LOADING_GET_CATEGORIES",
    SET_IS_LOADING_GET_CATEGORY_BY_ID = "SET_IS_LOADING_GET_CATEGORY_BY_ID",
    SET_IS_LOADING_ADD_CATEGORY = "SET_IS_LOADING_ADD_CATEGORY",
    SET_IS_LOADING_EDIT_CATEGORY = "SET_IS_LOADING_EDIT_CATEGORY",
    SET_IS_LOADING_DELETE_CATEGORY = "SET_IS_LOADING_DELETE_CATEGORY",
    SET_IS_LOADING_RECOVER_CATEGORY = "SET_IS_LOADING_RECOVER_CATEGORY",
}

export interface SetCategoriesAction {
    type: CategoryActionEnum.SET_CATEGORIES;
    payload: Category[];
}

export interface SetCategoryByIdAction {
    type: CategoryActionEnum.SET_CATEGORY_BY_ID;
    payload: Category | null;
}

export interface SetCategoriesCountAction {
    type: CategoryActionEnum.SET_CATEGORIES_COUNT;
    payload: number;
}

export interface SetIsLoadingGetCategoriesAction {
    type: CategoryActionEnum.SET_IS_LOADING_GET_CATEGORIES;
    payload: boolean;
}

export interface SetIsLoadingAddCategoryAction {
    type: CategoryActionEnum.SET_IS_LOADING_ADD_CATEGORY;
    payload: boolean;
}

export interface SetIsLoadingGetCategoryByIdAction {
    type: CategoryActionEnum.SET_IS_LOADING_GET_CATEGORY_BY_ID;
    payload: boolean;
}

export interface SetIsLoadingEditCategoryAction {
    type: CategoryActionEnum.SET_IS_LOADING_EDIT_CATEGORY;
    payload: boolean;
}

export interface SetIsLoadingDeleteCategoryAction {
    type: CategoryActionEnum.SET_IS_LOADING_DELETE_CATEGORY;
    payload: boolean;
}

export interface SetIsLoadingRecoverCategoryAction {
    type: CategoryActionEnum.SET_IS_LOADING_RECOVER_CATEGORY;
    payload: boolean;
}

export type CategoryAction =
    SetCategoriesAction |
    SetCategoryByIdAction |
    SetCategoriesCountAction |
    SetIsLoadingGetCategoriesAction |
    SetIsLoadingAddCategoryAction |
    SetIsLoadingGetCategoryByIdAction |
    SetIsLoadingEditCategoryAction |
    SetIsLoadingDeleteCategoryAction |
    SetIsLoadingRecoverCategoryAction;
