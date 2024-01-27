import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {
    BookOutlined,
    DashboardOutlined,
    SettingOutlined,
    UnorderedListOutlined,
    UserAddOutlined,
    UserOutlined,
    UserSwitchOutlined
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
import {Applications} from "./staff/Applications";
import {Settings} from "./staff/Settings";
import {UsersAdd} from "./staff/Users/pages/UsersAdd";
import {UsersEdit} from "./staff/Users/pages/UsersEdit";
import {NotFound} from "@pages/staff/NotFound";
import {Products} from "@pages/staff/Products";
import {Orders} from "@pages/staff/Orders";

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
    CATALOG = "/catalog",
    USERS = "/users",
    USERS_ADD = "/users/add",
    USERS_EDIT = "/users/edit/:id",
    PRODUCTS = "/products",
    ORDERS = "/orders",
    APPLICATIONS = "/applications",
    SETTINGS = "/settings",

    // ADMIN

}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, element: Login, name: txt.login},
];

export const staffRoutesSidebar: IRoute[] = [
    {path: RouteNames.DASHBOARD, element: Dashboard, name: txt.dashboard, icon: <DashboardOutlined/>, disabled: true},
    {path: RouteNames.CATALOG, element: Catalog, name: txt.catalog, icon: <UnorderedListOutlined/>},
    {path: RouteNames.USERS, element: Users, name: txt.users, icon: <UserOutlined/>},
    {path: RouteNames.PRODUCTS, element: Products, name: txt.products, icon: <DashboardOutlined/>},
    {path: RouteNames.ORDERS, element: Orders, name: txt.orders, icon: <DashboardOutlined/>},
    {
        path: RouteNames.APPLICATIONS,
        element: Applications,
        name: txt.applications,
        icon: <BookOutlined/>,
        disabled: true
    },
    {path: RouteNames.SETTINGS, element: Settings, name: txt.settings, icon: <SettingOutlined/>},
];

export const staffRoutes: IRoute[] = [
    {path: RouteNames.USERS_ADD, element: UsersAdd, name: txt.new_user, icon: <UserAddOutlined/>},
    {path: RouteNames.USERS_EDIT, element: UsersEdit, name: txt.user_profile, icon: <UserSwitchOutlined/>},
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
                    <Route path={"*"} element={<NotFound/>}/>
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
