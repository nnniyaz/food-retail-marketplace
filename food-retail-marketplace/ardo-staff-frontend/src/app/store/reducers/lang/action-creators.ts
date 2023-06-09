import {SetLangAction, LangActionEnum} from "./types";
import {LangsList} from "../../../../entities/base/MlString";
import {AppDispatch} from "../../index";

export const LangActionCreators = {
    setLang: (payload: LangsList): SetLangAction => ({type: LangActionEnum.SET_LANG, payload}),

    changeLang: (payload: LangsList) => (dispatch: AppDispatch) => {
        dispatch(LangActionCreators.setLang(payload));
    }
}
