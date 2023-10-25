import {Lang} from "@entities/base/MlString";
import {SetLangAction, LangActionEnum} from "./types";
import {AppDispatch} from "@app/store";

export const LangActionCreators = {
    setLang: (payload: Lang): SetLangAction => ({type: LangActionEnum.SET_LANG, payload}),
    changeLang: (payload: Lang) => (dispatch: AppDispatch) => {
        dispatch(LangActionCreators.setLang(payload));
    }
}
