import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {
    DashboardOutlined,
    SettingOutlined,
    UnorderedListOutlined,
    UserAddOutlined,
    UserOutlined,
    UserSwitchOutlined,
    AppstoreOutlined, ShoppingOutlined,
} from "@ant-design/icons";
import {MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {Layout} from "./layouts/Layout";
import {StaffLayout} from "./layouts/StaffLayout";
import {Login} from "./public/Login";
import {Dashboard} from "./staff/Dashboard";
import {Catalog} from "./staff/Catalog";
import {Users} from "./staff/Users";
import {Settings} from "./staff/Settings";
import {UsersAdd} from "./staff/Users/pages/UsersAdd";
import {UsersEdit} from "./staff/Users/pages/UsersEdit";
import {NotFound} from "@pages/staff/NotFound";
import {Products} from "@pages/staff/Products";
import {Orders} from "@pages/staff/Orders";
import {ProductsAdd} from "@pages/staff/Products/pages/ProductsAdd";
import {ProductsEdit} from "@pages/staff/Products/pages/ProductsEdit";
import {Sections} from "@pages/staff/Sections";
import {Categories} from "@pages/staff/Categories";

export interface IRoute {
    path: string;
    name: MlString;
    icon?: JSX.Element;
    element: React.ComponentType;
    disabled?: boolean;
}

export enum RouteNames {
    // PUBLIC
    LOGIN = "/login",

    // STAFF
    DASHBOARD = "/",
    ORDERS = "/orders",
    USERS = "/users",
    USERS_ADD = "/users/add",
    USERS_EDIT = "/users/edit/:id",
    CATALOG = "/catalog",
    SECTIONS = "/sections",
    SECTIONS_ADD = "/sections/add",
    SECTIONS_EDIT = "/sections/edit/:id",
    CATEGORIES = "/categories",
    CATEGORIES_ADD = "/categories/add",
    CATEGORIES_EDIT = "/categories/edit/:id",
    PRODUCTS = "/products",
    PRODUCTS_ADD = "/products/add",
    PRODUCTS_EDIT = "/products/edit/:id",
    SETTINGS = "/settings",
    NOT_FOUND = "/page-not-found",

    // ADMIN

}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, element: Login, name: txt.login},
];

export const staffRoutesSidebar: IRoute[] = [
    {path: RouteNames.DASHBOARD, element: Dashboard, name: txt.dashboard, icon: <DashboardOutlined/>, disabled: true},
    {path: RouteNames.ORDERS, element: Orders, name: txt.orders, icon: <DashboardOutlined/>},
    {path: RouteNames.USERS, element: Users, name: txt.users, icon: <UserOutlined/>},
    {path: RouteNames.CATALOG, element: Catalog, name: txt.catalog, icon: <UnorderedListOutlined/>},
    {path: RouteNames.SECTIONS, element: Sections, name: txt.sections, icon: <SettingOutlined/>},
    {path: RouteNames.CATEGORIES, element: Categories, name: txt.categories, icon: <AppstoreOutlined/>},
    {path: RouteNames.PRODUCTS, element: Products, name: txt.products, icon: <ShoppingOutlined />},
    {path: RouteNames.SETTINGS, element: Settings, name: txt.settings, icon: <SettingOutlined/>},
];

export const staffRoutes: IRoute[] = [
    {path: RouteNames.USERS_ADD, element: UsersAdd, name: txt.new_user, icon: <UserAddOutlined/>},
    {path: RouteNames.USERS_EDIT, element: UsersEdit, name: txt.user_profile, icon: <UserSwitchOutlined/>},
    {path: RouteNames.PRODUCTS_ADD, element: ProductsAdd, name: txt.new_product, icon: <UserAddOutlined/>},
    {path: RouteNames.PRODUCTS_EDIT, element: ProductsEdit, name: txt.product_details, icon: <UserSwitchOutlined/>},
    {path: RouteNames.NOT_FOUND, element: NotFound, name: txt.page_not_found, icon: <SettingOutlined/>},
];

const AppRouter = () => {
    const {isAuth} = useTypedSelector(state => state.user);

    return (
        <Routes>
            {isAuth
                ?
                <Route element={<StaffLayout/>}>
                    {[...staffRoutesSidebar, ...staffRoutes].filter(route => !route.disabled).map(route => (
                        <Route path={route.path} element={<route.element/>} key={route.path}/>
                    ))}
                    <Route path={"*"} element={<Users/>}/>
                </Route>
                :
                <Route element={<Layout/>}>
                    {publicRoutes.filter(route => !route.disabled).map(route => (
                        <Route path={route.path} element={<route.element/>} key={route.path}/>
                    ))}
                    <Route path={"*"} element={<Navigate to={RouteNames.LOGIN}/>}/>
                </Route>
            }
        </Routes>
    );
};

export default AppRouter;
