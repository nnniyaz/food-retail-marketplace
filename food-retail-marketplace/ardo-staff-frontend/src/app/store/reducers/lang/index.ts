import {Lang} from "@entities/base/MlString";
import {LangAction, LangActionEnum, LangState} from "./types";

const initialState: LangState = {
    currentLang: Lang.RU,
}

export default function LangReducer(state = initialState, action: LangAction): LangState {
    switch (action.type) {
        case LangActionEnum.SET_LANG:
            return {...state, currentLang: action.payload};
        default:
            return state;
    }
}
