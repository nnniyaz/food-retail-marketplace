import {MlString} from "entities/base/MlString";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {useState} from "react";
import {Login} from "./public/Login";
import {txt} from "../shared/core/i18ngen";
import {Layout} from "./layouts/Layout";

export interface IRoute {
    path: string;
    element: React.ComponentType;
    name: MlString;
    icon?: JSX.Element;
}

export enum RouteNames {
    // PUBLIC
    LOGIN = '/login',

    // USER
    HOME = '/',

    // ADMIN

}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, element: Login, name: txt.login},
];

export const privateAdminRoutes: IRoute[] = [
    {path: RouteNames.HOME, element: Login, name: txt.login},
];

const AppRouter = () => {
    const location = useLocation();
    const [initialLocation] = useState(localStorage.getItem('lastLocation') || RouteNames.LOGIN);
    const locationPathname = location.pathname;

    window.addEventListener('beforeunload', function (e) {
        localStorage.setItem('lastLocation', locationPathname);
    });

    const from = () => {
        return RouteNames.LOGIN;
    };

    return (
        <Routes>
            <Route element={<Layout/>}>
                {publicRoutes.map(route => <Route path={route.path} element={<route.element/>} key={route.path}/>)}
                <Route path={'*'} element={<Navigate to={RouteNames.LOGIN}/>}/>
            </Route>
        </Routes>
    );
};

export default AppRouter;

