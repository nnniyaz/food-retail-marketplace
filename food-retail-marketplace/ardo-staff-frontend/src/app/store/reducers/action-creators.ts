import {LangActionCreators} from "./lang/action-creators";
import {AuthActionCreators} from "pages/public/Login/store/auth/action-creators";
import {UserActionCreators} from "./user/action-creators";

export const allActionCreators = {
    ...LangActionCreators,
    ...AuthActionCreators,
    ...UserActionCreators,
}
