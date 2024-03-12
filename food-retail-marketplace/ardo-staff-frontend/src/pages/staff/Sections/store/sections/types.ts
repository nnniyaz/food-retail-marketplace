import {Section} from "@entities/section/section";

export interface SectionState {
    sections: Section[];
    sectionById: Section | null;
    sectionsCount: number;
    isLoadingGetSections: boolean;
    isLoadingAddSection: boolean;
    isLoadingGetSectionById: boolean;
    isLoadingEditSection: boolean;
    isLoadingDeleteSection: boolean;
    isLoadingRecoverSection: boolean;
}

export enum SectionActionEnum {
    SET_SECTIONS = "SET_SECTIONS",
    SET_SECTION_BY_ID = "SET_SECTION_BY_ID",
    SET_SECTIONS_COUNT = "SET_SECTIONS_COUNT",
    SET_IS_LOADING_GET_SECTIONS = "SET_IS_LOADING_GET_SECTIONS",
    SET_IS_LOADING_GET_SECTION_BY_ID = "SET_IS_LOADING_GET_SECTION_BY_ID",
    SET_IS_LOADING_ADD_SECTION = "SET_IS_LOADING_ADD_SECTION",
    SET_IS_LOADING_EDIT_SECTION = "SET_IS_LOADING_EDIT_SECTION",
    SET_IS_LOADING_DELETE_SECTION = "SET_IS_LOADING_DELETE_SECTION",
    SET_IS_LOADING_RECOVER_SECTION = "SET_IS_LOADING_RECOVER_SECTION",
}

export interface SetSectionsAction {
    type: SectionActionEnum.SET_SECTIONS;
    payload: Section[];
}

export interface SetSectionByIdAction {
    type: SectionActionEnum.SET_SECTION_BY_ID;
    payload: Section | null;
}

export interface SetSectionsCountAction {
    type: SectionActionEnum.SET_SECTIONS_COUNT;
    payload: number;
}

export interface SetIsLoadingGetSectionsAction {
    type: SectionActionEnum.SET_IS_LOADING_GET_SECTIONS;
    payload: boolean;
}

export interface SetIsLoadingAddSectionAction {
    type: SectionActionEnum.SET_IS_LOADING_ADD_SECTION;
    payload: boolean;
}

export interface SetIsLoadingGetSectionByIdAction {
    type: SectionActionEnum.SET_IS_LOADING_GET_SECTION_BY_ID;
    payload: boolean;
}

export interface SetIsLoadingEditSectionAction {
    type: SectionActionEnum.SET_IS_LOADING_EDIT_SECTION;
    payload: boolean;
}

export interface SetIsLoadingDeleteSectionAction {
    type: SectionActionEnum.SET_IS_LOADING_DELETE_SECTION;
    payload: boolean;
}

export interface SetIsLoadingRecoverSectionAction {
    type: SectionActionEnum.SET_IS_LOADING_RECOVER_SECTION;
    payload: boolean;
}

export type SectionAction =
    SetSectionsAction |
    SetSectionByIdAction |
    SetSectionsCountAction |
    SetIsLoadingGetSectionsAction |
    SetIsLoadingAddSectionAction |
    SetIsLoadingGetSectionByIdAction |
    SetIsLoadingEditSectionAction |
    SetIsLoadingDeleteSectionAction |
    SetIsLoadingRecoverSectionAction;
