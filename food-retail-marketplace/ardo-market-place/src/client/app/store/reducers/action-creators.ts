import {catalogActionCreator} from "@app/store/reducers/catalog/action-creators.ts";
import {systemActionCreator} from "@app/store/reducers/system/action-creators.ts";

export const allActionCreators = {
    ...catalogActionCreator,
    ...systemActionCreator,
}
