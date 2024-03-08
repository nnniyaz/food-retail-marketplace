import {SystemAction, SystemActionEnum, SystemState} from "@app/store/reducers/system/types.ts";
import {Langs} from "@domain/base/mlString/mlString.ts";
import {Currency} from "@domain/base/currency/currency.ts";

const initialState: SystemState = {
    mode: "development",
    currentLang: Langs.EN,
    langs: [Langs.EN, Langs.RU],
    currency: Currency.HKD
};

export default function systemStateReducer(state = initialState, action: SystemAction): SystemState {
    switch (action.type) {
        case SystemActionEnum.INIT_SYSTEM_STATE:
            return {...state, mode: action.payload.mode};
        default:
            return state;
    }
}
