import {LangsList} from "entities/base/MlString";

export interface LangState {
    currentLang: LangsList;
}

export enum LangActionEnum {
    SET_LANG = 'SET_LANG',
}

export type SetLangAction = {
    type: LangActionEnum.SET_LANG;
    payload: LangsList;
}

export type LangAction = SetLangAction;
