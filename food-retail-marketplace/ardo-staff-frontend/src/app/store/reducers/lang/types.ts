import {Langs} from "@entities/base/MlString";

export interface LangState {
    currentLang: Langs;
}

export enum LangActionEnum {
    SET_LANG = 'SET_LANG',
}

export interface SetLangAction {
    type: LangActionEnum.SET_LANG;
    payload: Langs;
}

export type LangAction = SetLangAction;
