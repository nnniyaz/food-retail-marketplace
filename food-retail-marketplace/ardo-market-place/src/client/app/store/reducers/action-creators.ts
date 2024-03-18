import {catalogActionCreator} from "@app/store/reducers/catalog/action-creators.ts";
import {systemActionCreator} from "@app/store/reducers/system/action-creators.ts";
import {cartActionCreator} from "@app/store/reducers/cart/action-creators.ts";
import {UserActionCreator} from "@app/store/reducers/user/action-creators.ts";

export const allActionCreators = {
    ...catalogActionCreator,
    ...systemActionCreator,
    ...cartActionCreator,
    ...UserActionCreator,
}
