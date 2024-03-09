import {Cfg} from "@domain/base/cfg/cfg.ts";
import {Langs} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";

export interface SystemState {
    cfg: Cfg;
    currentLang: Langs;
    langs: Langs[];
    currency: Currency;
}

export enum SystemActionEnum {
    INIT_SYSTEM_STATE = "INIT_SYSTEM_STATE",
}

export interface InitSystemStateAction {
    type: SystemActionEnum.INIT_SYSTEM_STATE;
    payload: Cfg;
}

export type SystemAction = InitSystemStateAction;
