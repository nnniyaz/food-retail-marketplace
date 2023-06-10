import React, {useState} from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {MlString} from "entities/base/MlString";
import {BookOutlined, DashboardOutlined, SettingOutlined, ShopOutlined, UserOutlined} from "@ant-design/icons";
import {txt} from "shared/core/i18ngen";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {Layout} from "./layouts/Layout";
import {StaffLayout} from "./layouts/StaffLayout";
import {Login} from "./public/Login";
import {Dashboard} from "./staff/Dashboard";
import {Users} from "./staff/Users";
import {Organizations} from "./staff/Organizations";
import {Applications} from "./staff/Applications";
import {Settings} from "./staff/Settings";

export interface IRoute {
    path: string;
    name: MlString;
    icon?: JSX.Element;
    element: React.ComponentType;
}

export enum RouteNames {
    // PUBLIC
    LOGIN = "/login",

    // STAFF
    DASHBOARD = "/",
    USERS = "/users",
    ORGANIZATIONS = "/organizations",
    APPLICATIONS = "/applications",
    SETTINGS = "/settings",

    // ADMIN

}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, element: Login, name: txt.login},
];

export const staffRoutes: IRoute[] = [
    {path: RouteNames.DASHBOARD, element: Dashboard, name: txt.dashboard, icon: <DashboardOutlined/>},
    {path: RouteNames.USERS, element: Users, name: txt.users, icon: <UserOutlined/>},
    {path: RouteNames.ORGANIZATIONS, element: Organizations, name: txt.organizations, icon: <ShopOutlined/>},
    {path: RouteNames.APPLICATIONS, element: Applications, name: txt.applications, icon: <BookOutlined/>},
    {path: RouteNames.SETTINGS, element: Settings, name: txt.settings, icon: <SettingOutlined/>},
];

const AppRouter = () => {
    const location = useLocation();
    const {isAuth} = useTypedSelector(state => state.auth);
    const [initialLocation] = useState(localStorage.getItem("lastLocation") || RouteNames.LOGIN);
    const locationPathname = location.pathname;

    window.addEventListener("beforeunload", function (e) {
        localStorage.setItem("lastLocation", locationPathname);
    });

    const from = () => {
        if (isAuth) {
            return initialLocation || RouteNames.DASHBOARD;
        }
        return RouteNames.LOGIN;
    };

    return (
        <Routes>
            {isAuth
                ?
                <Route element={<StaffLayout/>}>
                    {staffRoutes.map(route => (
                        <Route path={route.path} element={<route.element/>} key={route.path}/>
                    ))}
                    <Route path={"*"} element={<Navigate to={from()}/>}/>
                </Route>
                :
                <Route element={<Layout/>}>
                    {publicRoutes.map(route => (
                        <Route path={route.path} element={<route.element/>} key={route.path}/>
                    ))}
                    <Route path={"*"} element={<Navigate to={RouteNames.LOGIN}/>}/>
                </Route>
            }
        </Routes>
    );
};

export default AppRouter;

