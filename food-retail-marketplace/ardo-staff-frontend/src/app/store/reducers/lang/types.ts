import {Lang} from "@entities/base/MlString";

export interface LangState {
    currentLang: Lang;
}

export enum LangActionEnum {
    SET_LANG = 'SET_LANG',
}

export interface SetLangAction {
    type: LangActionEnum.SET_LANG;
    payload: Lang;
}

export type LangAction = SetLangAction;
