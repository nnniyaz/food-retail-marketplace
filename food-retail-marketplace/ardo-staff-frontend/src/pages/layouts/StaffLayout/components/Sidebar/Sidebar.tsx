import React, {FC} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {RouteNames, staffRoutes} from "pages";
import {Text} from "shared/ui/Text";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./Sidebar.module.scss";

export const Sidebar: FC = () => {
    const location = useLocation();
    const upperSlice = staffRoutes.filter(item => item.path !== RouteNames.SETTINGS);
    const lowerSlice = staffRoutes.filter(item => item.path === RouteNames.SETTINGS);
    const {currentLang} = useTypedSelector(state => state.lang);
    const activeLink = (path: string) => {
        if (path === "/") {
            return path === location.pathname;
        }
        return location.pathname.includes(path);
    }
    return (
        <div className={classes.sidebar}>
            {upperSlice.map((item, index) => (
                <NavLink
                    to={item.path}
                    className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
                    key={index}
                >
                    <div className={classes.sidebar__item__icon}>{item.icon}</div>
                    <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
                </NavLink>
            ))}
            <div className={classes.divider}></div>
            {lowerSlice.map((item, index) => (
                <NavLink
                    to={item.path}
                    className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
                    key={index}
                >
                    <div className={classes.sidebar__item__icon}>{item.icon}</div>
                    <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
                </NavLink>
            ))}
        </div>
    )
}
