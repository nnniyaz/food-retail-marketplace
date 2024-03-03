import {ComponentType} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {Home} from "@pages/Home";
import {Catalog} from "@pages/Catalog";
import {Cart} from "@pages/Cart";
import {Favourites} from "@pages/Favourites";
import {Profile} from "@pages/Profile";

interface IRoute {
    path: string;
    component: ComponentType;
}

export enum RouteNames {
    HOME = "/",
    CATALOG = "/catalog",
    CART = "/cart",
    FAVOURITES = "/favourites",
    PROFILE = "/profile",
}

const routes: IRoute[] = [
    {path: RouteNames.HOME, component: Home},
    {path: RouteNames.CATALOG, component: Catalog},
    {path: RouteNames.CART, component: Cart},
    {path: RouteNames.FAVOURITES, component: Favourites},
    {path: RouteNames.PROFILE, component: Profile},
];

interface RoutingProps {

}

export const Routing = ({}: RoutingProps) => {
    return (
        <Routes>
            {routes.map(route =>
                <Route path={route.path} element={<route.component/>} key={route.path}/>
            )}
            <Route path={'*'} element={<Navigate to={RouteNames.HOME}/>}/>
        </Routes>
    );
};
