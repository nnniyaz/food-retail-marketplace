import React, {CSSProperties, FC, useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {Text} from "shared/ui/Text";
import {Loader} from "shared/ui/Loader";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {Header} from "./components/Header";
import {Sidebar} from "./components/Sidebar";
import {staffRoutes, staffRoutesSidebar} from "../../index";
import classes from "./StaffLayout.module.scss";

export const StaffLayout: FC = () => {
    const location = useLocation();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingLogout} = useTypedSelector(state => state.auth);
    const [isSidebarShown, setIsSidebarShown] = useState<boolean>(false);
    const currentRoute = [...staffRoutesSidebar, ...staffRoutes].find(route => {
        let path = route.path;
        let locationPath = location.pathname;
        if (route.path.includes("edit")) {
            path = route.path.split("/:id")[0];
        }
        if (location.pathname.includes("edit")) {
            locationPath = path.split("/edit")[0] + "/edit";
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

    return (
        <React.Fragment>
            <div className={classes.layout} style={loadingStyle}>
                <Header isShown={isSidebarShown} setIsShown={setIsSidebarShown}/>
                <div className={classes.body}>
                    <Sidebar isShown={isSidebarShown} setIsShown={setIsSidebarShown}/>
                    <div className={classes.content} style={{opacity: isSidebarShown ? .5 : 1}}>
                        <div className={classes.content__title}>
                            <div className={classes.content__title__icon}>
                                {currentRoute?.icon}
                            </div>
                            <Text text={currentRoute?.name[currentLang] || ""} type={"label-large"}/>
                        </div>
                        <Outlet/>
                    </div>
                </div>
            </div>
            {isLoadingLogout && <div className={classes.cover}><Loader size={40}/></div>}
        </React.Fragment>
    )
}
