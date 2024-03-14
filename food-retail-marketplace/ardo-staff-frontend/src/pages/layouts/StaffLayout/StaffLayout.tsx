import React, {CSSProperties, FC, useEffect, useState} from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import {Breadcrumb} from "antd";
import {IRoute, RouteNames, staffRoutes, staffRoutesSidebar} from "@pages//";
import {ErrorBoundary} from "@pages/layouts/StaffLayout/components/ErrorBoundary";
import {Text} from "@shared/ui/Text";
import {Loader} from "@shared/ui/Loader";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {Header} from "./components/Header";
import {Sidebar} from "./components/Sidebar";
import classes from "./StaffLayout.module.scss";

export const StaffLayout: FC = () => {
    const location = useLocation();
    const {breadcrumbs} = useTypedSelector(state => state.system);
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingLogout} = useTypedSelector(state => state.auth);
    const {setBreadcrumbs} = useActions();
    const [isSidebarShown, setIsSidebarShown] = useState<boolean>(false);
    const currentRoute = [...staffRoutesSidebar, ...staffRoutes].find(route => {
        let path = route.path;
        let locationPath = location.pathname;
        if (route.path.includes("edit")) {
            path = route.path.split("/:id")[0];
        }
        if (location.pathname.includes("edit")) {
            locationPath = location.pathname.split("/edit")[0] + "/edit";
        }
        return path.includes(locationPath);
    });

    const loadingStyle: CSSProperties = {
        opacity: isLoadingLogout ? .5 : 1,
        pointerEvents: isLoadingLogout ? "none" : "auto"
    }

    useEffect(() => {
        isLoadingLogout ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
    }, [isLoadingLogout]);

    useEffect(() => {
        if (isSidebarShown) {
            document.body.style.height = "100%";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isSidebarShown]);

    useEffect(() => {
        const routes = [...staffRoutesSidebar, ...staffRoutes];
        let breadcrumbs: IRoute[] = [];
        breadcrumbs.push(routes.find(route => route.path === currentRoute?.path) || {} as IRoute);

        if (location.pathname === RouteNames.USERS_ADD) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.USERS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.USERS_ADD) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.USERS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.USERS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.USERS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.ORDERS_ADD) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.ORDERS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.ORDERS_ADD) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.ORDERS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.ORDERS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.ORDERS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.SECTIONS_ADD) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.SECTIONS) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.SECTIONS_ADD) || {} as IRoute);
        }  else if (location.pathname.includes(RouteNames.SECTIONS_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.SECTIONS) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.SECTIONS_EDIT) || {} as IRoute),
                path: location.pathname
            });
        } else if (location.pathname === RouteNames.CATEGORIES_ADD) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.CATEGORIES) || {} as IRoute);
            breadcrumbs.push(routes.find(route => route.path === RouteNames.CATEGORIES_ADD) || {} as IRoute);
        } else if (location.pathname.includes(RouteNames.CATEGORIES_EDIT.replace("/:id", ""))) {
            breadcrumbs = [];
            breadcrumbs.push(routes.find(route => route.path === RouteNames.CATEGORIES) || {} as IRoute);
            breadcrumbs.push({
                ...(routes.find(route => route.path === RouteNames.CATEGORIES_EDIT) || {} as IRoute),
                path: location.pathname
            });
        }
        setBreadcrumbs(breadcrumbs);
    }, [location.pathname]);

    return (
        <React.Fragment>
            <div className={classes.layout} style={loadingStyle}>
                <Header isShown={isSidebarShown} setIsShown={setIsSidebarShown}/>
                <div className={classes.body}>
                    <Sidebar isShown={isSidebarShown} setIsShown={setIsSidebarShown}/>
                    <div className={classes.content} style={{opacity: isSidebarShown ? .5 : 1}}>
                        <div className={classes.content__title}>
                            <Breadcrumb
                                items={breadcrumbs.map((item, index) => (
                                    {
                                        title: (
                                            <Link
                                                to={item.path}
                                                className={index === breadcrumbs.length - 1 ? classes.breadcrumb__active : classes.breadcrumb}
                                            >
                                                {item.name?.[currentLang]}
                                            </Link>
                                        )
                                    }
                                ))}
                            />
                            <div className={classes.content__title__header}>
                                <div className={classes.content__title__icon}>{currentRoute?.icon}</div>
                                <Text text={currentRoute?.name[currentLang] || ""} type={"label-large"}/>
                            </div>
                        </div>

                        <ErrorBoundary>
                            <Outlet/>
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
            {isLoadingLogout && <div className={classes.cover}><Loader size={40}/></div>}
        </React.Fragment>
    )
}
