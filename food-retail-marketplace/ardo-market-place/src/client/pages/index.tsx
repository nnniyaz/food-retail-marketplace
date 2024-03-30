import {ComponentType, useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {Home} from "@pages/Home";
import {Catalog} from "@pages/Catalog";
import {Cart} from "@pages/Cart";
import {Favourites} from "@pages/Favourites";
import {Profile} from "@pages/Profile";
import {Layout} from "@pages/Layout";
import {List} from "@pages/List";
import {Settings} from "@pages/Profile/pages/Settings";
import {Orders} from "@pages/Profile/pages/Orders";
import {Address} from "@pages/Profile/pages/Address";
import {Checkout} from "@pages/Checkout";
import {Success} from "@pages/Success";
import {FullName} from "@pages/Profile/pages/Settings/pages/FullName";
import {Email} from "@pages/Profile/pages/Settings/pages/Email";
import {Phone} from "@pages/Profile/pages/Settings/pages/Phone";
import {Password} from "@pages/Profile/pages/Settings/pages/Password";
import {SignUp} from "@pages/SignUp";

const {LoadingOutlined} = AntdIcons;

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
    SETTINGS = "/profile/settings",
    SETTINGS_FULL_NAME = "/profile/settings/full-name",
    SETTINGS_EMAIL = "/profile/settings/email",
    SETTINGS_PHONE = "/profile/settings/phone",
    SETTINGS_PASSWORD = "/profile/settings/password",
    ORDERS = "/profile/orders",
    ADDRESS = "/profile/address",
    SIGN_UP = "/sign-up",
}

const publicRoutes: IRoute[] = [
    {path: RouteNames.HOME, component: Home},
    {path: RouteNames.CATALOG, component: Catalog},
    {path: RouteNames.LIST, component: List},
    {path: RouteNames.CART, component: Cart},
    {path: RouteNames.FAVOURITES, component: Favourites},
    {path: RouteNames.PROFILE, component: Profile},
    {path: RouteNames.SIGN_UP, component: SignUp},
];

const privateRoutes: IRoute[] = [
    {path: RouteNames.CHECKOUT, component: Checkout},
    {path: RouteNames.SUCCESS, component: Success},
    {path: RouteNames.SETTINGS, component: Settings},
    {path: RouteNames.SETTINGS_FULL_NAME, component: FullName},
    {path: RouteNames.SETTINGS_EMAIL, component: Email},
    {path: RouteNames.SETTINGS_PHONE, component: Phone},
    {path: RouteNames.SETTINGS_PASSWORD, component: Password},
    {path: RouteNames.ORDERS, component: Orders},
    {path: RouteNames.ADDRESS, component: Address},
];

interface RoutingProps {

}

export const Routing = ({}: RoutingProps) => {
    const {catalog} = useTypedSelector(state => state.catalogState);
    const {isAuth, isLoadingGetUser} = useTypedSelector(state => state.userState);
    const {fetchUser} = useActions();

    useEffect(() => {
        if (isAuth) return;
        fetchUser(true);
    }, []);

    if (!catalog) {
        return null;
    }
    if (isLoadingGetUser) {
        return (
            <div style={{
                width: "100%",
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <LoadingOutlined/>
            </div>
        )
    }
    return (
        <Routes>
            <Route element={<Layout/>}>
                {
                    isAuth ? (
                        [...publicRoutes, ...privateRoutes].map(route =>
                            <Route path={route.path} element={<route.component/>} key={route.path}/>
                        )
                    ) : (
                        publicRoutes.map(route =>
                            <Route path={route.path} element={<route.component/>} key={route.path}/>
                        )
                    )
                }
                <Route path={'*'} element={<Navigate to={RouteNames.HOME}/>}/>
            </Route>
        </Routes>
    );
};
