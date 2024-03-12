import {CategoryState, CategoryActionEnum, CategoryAction} from "./types";

const initialState: CategoryState = {
    categories: [],
    categoryById: null,
    categoriesCount: 0,
    isLoadingGetCategories: false,
    isLoadingAddCategory: false,
    isLoadingGetCategoryById: false,
    isLoadingEditCategory: false,
    isLoadingDeleteCategory: false,
    isLoadingRecoverCategory: false,
};

export default function categoryReducer(state = initialState, action: CategoryAction): CategoryState {
    switch (action.type) {
        case CategoryActionEnum.SET_CATEGORIES:
            return {...state, categories: action.payload};
        case CategoryActionEnum.SET_CATEGORY_BY_ID:
            return {...state, categoryById: action.payload};
        case CategoryActionEnum.SET_CATEGORIES_COUNT:
            return {...state, categoriesCount: action.payload};
        case CategoryActionEnum.SET_IS_LOADING_GET_CATEGORIES:
            return {...state, isLoadingGetCategories: action.payload};
        case CategoryActionEnum.SET_IS_LOADING_ADD_CATEGORY:
            return {...state, isLoadingAddCategory: action.payload};
        case CategoryActionEnum.SET_IS_LOADING_GET_CATEGORY_BY_ID:
            return {...state, isLoadingGetCategoryById: action.payload};
        case CategoryActionEnum.SET_IS_LOADING_EDIT_CATEGORY:
            return {...state, isLoadingEditCategory: action.payload};
        case CategoryActionEnum.SET_IS_LOADING_DELETE_CATEGORY:
            return {...state, isLoadingDeleteCategory: action.payload};
        case CategoryActionEnum.SET_IS_LOADING_RECOVER_CATEGORY:
            return {...state, isLoadingRecoverCategory: action.payload};
        default:
            return state;
    }
}
