import React, {FC, useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {Text} from "shared/ui/Text";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {Header} from "./components/Header";
import {Sidebar} from "./components/Sidebar";
import {staffRoutes} from "../../index";
import classes from "./StaffLayout.module.scss";

export const StaffLayout: FC = () => {
    const location = useLocation();
    const {currentLang} = useTypedSelector(state => state.lang);
    const [isSidebarShown, setIsSidebarShown] = useState<boolean>(false);
    const currentRoute = staffRoutes.find(route => route.path.includes(location.pathname));

    useEffect(() => {
        if (isSidebarShown) {
            document.body.style.height = "100%";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isSidebarShown]);

    return (
        <div className={classes.layout}>
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
    )
}
