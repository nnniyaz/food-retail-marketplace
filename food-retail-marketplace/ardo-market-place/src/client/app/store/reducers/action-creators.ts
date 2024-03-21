import {CatalogActionCreator} from "@app/store/reducers/catalog/action-creators.ts";
import {SystemActionCreator} from "@app/store/reducers/system/action-creators.ts";
import {CartActionCreator} from "@app/store/reducers/cart/action-creators.ts";
import {UserActionCreator} from "@app/store/reducers/user/action-creators.ts";

export const allActionCreators = {
    ...CatalogActionCreator,
    ...SystemActionCreator,
    ...CartActionCreator,
    ...UserActionCreator,
}
