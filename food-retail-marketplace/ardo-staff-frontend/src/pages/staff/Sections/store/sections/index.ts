import {SectionAction, SectionActionEnum, SectionState} from "./types";

const initialState: SectionState = {
    sections: [],
    sectionById: null,
    sectionsCount: 0,
    isLoadingGetSections: false,
    isLoadingAddSection: false,
    isLoadingGetSectionById: false,
    isLoadingEditSection: false,
    isLoadingDeleteSection: false,
    isLoadingRecoverSection: false,
};

export default function sectionReducer(state = initialState, action: SectionAction): SectionState {
    switch (action.type) {
        case SectionActionEnum.SET_SECTIONS:
            return {...state, sections: action.payload};
        case SectionActionEnum.SET_SECTION_BY_ID:
            return {...state, sectionById: action.payload};
        case SectionActionEnum.SET_SECTIONS_COUNT:
            return {...state, sectionsCount: action.payload};
        case SectionActionEnum.SET_IS_LOADING_GET_SECTIONS:
            return {...state, isLoadingGetSections: action.payload};
        case SectionActionEnum.SET_IS_LOADING_ADD_SECTION:
            return {...state, isLoadingAddSection: action.payload};
        case SectionActionEnum.SET_IS_LOADING_GET_SECTION_BY_ID:
            return {...state, isLoadingGetSectionById: action.payload};
        case SectionActionEnum.SET_IS_LOADING_EDIT_SECTION:
            return {...state, isLoadingEditSection: action.payload};
        case SectionActionEnum.SET_IS_LOADING_DELETE_SECTION:
            return {...state, isLoadingDeleteSection: action.payload};
        case SectionActionEnum.SET_IS_LOADING_RECOVER_SECTION:
            return {...state, isLoadingRecoverSection: action.payload};
        default:
            return state;
    }
}
