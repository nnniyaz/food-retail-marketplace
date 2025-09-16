import {Langs} from "@entities/base/MlString";
import {SetLangAction, LangActionEnum} from "./types";
import {AppDispatch} from "@app/store";

export const LangActionCreators = {
    setLang: (payload: Langs): SetLangAction => ({type: LangActionEnum.SET_LANG, payload}),
    changeLang: (payload: Langs) => (dispatch: AppDispatch) => {
        dispatch(LangActionCreators.setLang(payload));
    }
}
