import {LangActionCreators} from "./lang/action-creators";
import {AuthActionCreators} from "@pages/public/Login/store/auth/action-creators";
import {UserActionCreators} from "./user/action-creators";
import {UsersActionCreators} from "@pages/staff/Users/store/user/action-creators";
import {SystemActionCreators} from "./system/action-creators";
import {ProductsActionCreators} from "@pages/staff/Products/store/product/action-creators";
import {SectionActionCreators} from "@pages/staff/Sections/store/sections/action-creators";
import {CategoryActionCreators} from "@pages/staff/Categories/store/categories/action-creators";
import {CatalogActionCreators} from "@pages/staff/Catalog/store/catalog/action-creators";
import {SlideActionCreators} from "@pages/staff/Slides/store/slides/action-creators";
import {OrdersActionCreators} from "@pages/staff/Orders/store/order/action-creators";

export const allActionCreators = {
    ...LangActionCreators,
    ...AuthActionCreators,
    ...UserActionCreators,
    ...UsersActionCreators,
    ...SystemActionCreators,
    ...ProductsActionCreators,
    ...SectionActionCreators,
    ...CategoryActionCreators,
    ...CatalogActionCreators,
    ...SlideActionCreators,
    ...OrdersActionCreators
}
