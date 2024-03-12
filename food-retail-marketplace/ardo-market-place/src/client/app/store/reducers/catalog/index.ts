import {CatalogAction, CatalogActionEnum, CatalogState} from "@app/store/reducers/catalog/types.ts";

const initialState: CatalogState = {
    catalog: null,
    currentSection: {
        sectionId: "",
        categories: []
    },
    currentCategory: {
        categoryId: "",
        products: []
    }
}

export default function catalogReducer(state = initialState, action: CatalogAction): CatalogState {
    switch (action.type) {
        case CatalogActionEnum.INIT_CATALOG_STATE:
            return {...state, catalog: action.payload};
        case CatalogActionEnum.SET_CURRENT_SECTION:
            return {...state, currentSection: action.payload};
        case CatalogActionEnum.SET_CURRENT_CATEGORY:
            return {...state, currentCategory: action.payload};
        default:
            return state;
    }
}
