import {Cfg} from "@domain/base/cfg/cfg.ts";
import {Langs} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";

export interface SystemState {
    cfg: Cfg;
    currentLang: Langs;
    langs: Langs[];
    currency: Currency;
    search: string;
}

export enum SystemActionEnum {
    INIT_SYSTEM_STATE = "INIT_SYSTEM_STATE",
    SET_SEARCH = "SET_SEARCH",
}

export interface InitSystemStateAction {
    type: SystemActionEnum.INIT_SYSTEM_STATE;
    payload: Cfg;
}

export interface SetSearchAction {
    type: SystemActionEnum.SET_SEARCH;
    payload: string;
}

export type SystemAction = InitSystemStateAction | SetSearchAction;
