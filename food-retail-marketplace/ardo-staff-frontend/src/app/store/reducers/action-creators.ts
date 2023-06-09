import {LangActionCreators} from "./lang/action-creators";
import {AuthActionCreators} from "./auth/action-creators";

export const allActionCreators = {
    ...LangActionCreators,
    ...AuthActionCreators,
}
