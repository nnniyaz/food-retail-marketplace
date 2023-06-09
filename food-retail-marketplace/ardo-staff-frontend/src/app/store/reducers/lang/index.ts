import {LangsList} from "entities/base/MlString";
import {LangAction, LangActionEnum, LangState} from "./types";

const initialState: LangState = {
    currentLang: LangsList.RU,
}

export default function LangReducer(state = initialState, action: LangAction): LangState {
    switch (action.type) {
        case LangActionEnum.SET_LANG:
            return {...state, currentLang: action.payload};
        default:
            return state;
    }
}
