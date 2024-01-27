import {LangActionCreators} from "./lang/action-creators";
import {AuthActionCreators} from "@pages/public/Login/store/auth/action-creators";
import {UserActionCreators} from "./user/action-creators";
import {UsersActionCreators} from "@pages/staff/Users/store/user/action-creators";
import {SystemActionCreators} from "./system/action-creators";
import {ProductsActionCreators} from "@pages/staff/Products/store/product/action-creators";

export const allActionCreators = {
    ...LangActionCreators,
    ...AuthActionCreators,
    ...UserActionCreators,
    ...UsersActionCreators,
    ...SystemActionCreators,
    ...ProductsActionCreators
}
