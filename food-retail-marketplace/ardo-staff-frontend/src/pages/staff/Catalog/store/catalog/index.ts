import {CatalogAction, CatalogActionEnum, CatalogState} from "./types";

const initialState: CatalogState = {
    catalog: null,
    isLoadingGetCatalog: false,
    isLoadingEditCatalog: false,
    isLoadingPublishCatalog: false,
};

export default function catalogReducer(state = initialState, action: CatalogAction): CatalogState {
    switch (action.type) {
        case CatalogActionEnum.SET_CATALOG:
            return {...state, catalog: action.payload};
        case CatalogActionEnum.SET_IS_LOADING_GET_CATALOG:
            return {...state, isLoadingGetCatalog: action.payload};
        case CatalogActionEnum.SET_IS_LOADING_EDIT_CATALOG:
            return {...state, isLoadingEditCatalog: action.payload};
        case CatalogActionEnum.SET_IS_LOADING_PUBLISH_CATALOG:
            return {...state, isLoadingPublishCatalog: action.payload};
        default:
            return state;
    }
}
