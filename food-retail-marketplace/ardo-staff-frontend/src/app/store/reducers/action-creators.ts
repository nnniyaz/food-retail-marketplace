import {LangActionCreators} from "./lang/action-creators";
import {AuthActionCreators} from "@pages/public/Login/store/auth/action-creators";
import {UserActionCreators} from "./user/action-creators";
import {UsersActionCreators} from "@pages/staff/Users/store/user/action-creators";
import {OrganizationActionCreators} from "@pages/staff/Organizations/store/organizations/action-creators";
import {SystemActionCreators} from "./system/action-creators";

export const allActionCreators = {
    ...LangActionCreators,
    ...AuthActionCreators,
    ...UserActionCreators,
    ...UsersActionCreators,
    ...OrganizationActionCreators,
    ...SystemActionCreators
}
