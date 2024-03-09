import {ComponentType} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {Home} from "@pages/Home";
import {Catalog} from "@pages/Catalog";
import {Cart} from "@pages/Cart";
import {Favourites} from "@pages/Favourites";
import {Profile} from "@pages/Profile";
import {Layout} from "@pages/Layout";
import {List} from "@pages/List";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

interface IRoute {
    path: string;
    component: ComponentType;
}

export enum RouteNames {
    HOME = "/",
    CATALOG = "/catalog",
    LIST = "/:sectionName/:sectionId",
    PRODUCT = "/:sectionName/:sectionId/:categoryName/:categoryId/:productName/:productId",
    CART = "/cart",
    CHECKOUT = "/checkout",
    SUCCESS = "/success",
    FAVOURITES = "/favourites",
    PROFILE = "/profile",
}

const routes: IRoute[] = [
    {path: RouteNames.HOME, component: Home},
    {path: RouteNames.CATALOG, component: Catalog},
    {path: RouteNames.LIST, component: List},
    {path: RouteNames.CART, component: Cart},
    {path: RouteNames.FAVOURITES, component: Favourites},
    {path: RouteNames.PROFILE, component: Profile},
];

interface RoutingProps {

}

export const Routing = ({}: RoutingProps) => {
    const {catalog} = useTypedSelector(state => state.catalogState);

    if (!catalog) {
        return null;
    }
    return (
        <Routes>
            <Route element={<Layout/>}>
                {routes.map(route =>
                    <Route path={route.path} element={<route.component/>} key={route.path}/>
                )}
                <Route path={'*'} element={<Navigate to={RouteNames.HOME}/>}/>
            </Route>
        </Routes>
    );
};
