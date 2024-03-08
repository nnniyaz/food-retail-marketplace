import {Langs} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";

export interface SystemState {
    mode: "development" | "production";
    currentLang: Langs;
    langs: Langs[];
    currency: Currency;
}

export enum SystemActionEnum {
    INIT_SYSTEM_STATE = "INIT_SYSTEM_STATE",
}

export interface InitSystemStateAction {
    type: SystemActionEnum.INIT_SYSTEM_STATE;
    payload: {
        mode: "development" | "production"
    };
}

export type SystemAction = InitSystemStateAction;
