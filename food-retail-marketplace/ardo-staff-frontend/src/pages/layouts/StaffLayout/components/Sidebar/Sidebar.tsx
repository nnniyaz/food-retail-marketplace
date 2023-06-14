import React, {FC, useMemo} from "react";
import {MenuFoldOutlined} from "@ant-design/icons";
import {Transition, TransitionStatus} from "react-transition-group";
import {NavLink, useLocation} from "react-router-dom";
import {RouteNames, staffRoutes} from "pages";
import {Logo} from "shared/ui/Logo";
import {Text} from "shared/ui/Text";
import {Divider} from "shared/ui/Divider";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./Sidebar.module.scss";
import {Credits} from "../../../../../shared/ui/Credits";

interface HeaderProps {
    isShown: boolean;
    setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

export const Sidebar: FC<HeaderProps> = ({isShown, setIsShown}) => {
    const location = useLocation();
    const upperSlice = staffRoutes.filter(item => item.path !== RouteNames.SETTINGS);
    const lowerSlice = staffRoutes.filter(item => item.path === RouteNames.SETTINGS);
    const {currentLang} = useTypedSelector(state => state.lang);
    const width = useMemo(() => window.innerWidth, [window.innerWidth]);
    const activeLink = (path: string) => {
        if (path === "/") {
            return path === location.pathname;
        }
        return location.pathname.includes(path);
    }
    const transitionClasses: Record<TransitionStatus, string> = {
        entering: classes.sidebar__enter__active,
        entered: classes.sidebar__enter__done,
        exiting: classes.sidebar__exit__active,
        exited: classes.sidebar__exit__done,
        unmounted: classes.sidebar__exit__done,
    }

    const handleOnClick = () => {
        setIsShown(false);
    }

    if (width <= 1340) {
        return (
            <Transition in={isShown} timeout={300} mountOnEnter unmountOnExit>
                {state => (
                    <div className={`${classes.sidebar} ${transitionClasses[state]}`}>
                        <div className={classes.sidebar__header}>
                            <MenuFoldOutlined className={classes.burger} onClick={() => setIsShown(false)}/>
                            <Logo/>
                        </div>
                        <Divider/>
                        {upperSlice.map((item, index) => (
                            <NavLink
                                to={item.path}
                                onClick={handleOnClick}
                                className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
                                key={index}
                            >
                                <div className={classes.sidebar__item__icon}>{item.icon}</div>
                                <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
                            </NavLink>
                        ))}
                        <Divider/>
                        {lowerSlice.map((item, index) => (
                            <NavLink
                                to={item.path}
                                onClick={handleOnClick}
                                className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
                                key={index}
                            >
                                <div className={classes.sidebar__item__icon}>{item.icon}</div>
                                <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
                            </NavLink>
                        ))}
                        <Credits/>
                    </div>
                )}
            </Transition>
        )
    }

    return (
        <div className={classes.sidebar}>
            <div className={classes.sidebar__header}>
                <MenuFoldOutlined className={classes.burger} onClick={() => setIsShown(false)}/>
                <Logo/>
                <Divider/>
            </div>
            {upperSlice.map((item, index) => (
                <NavLink
                    to={item.path}
                    onClick={handleOnClick}
                    className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
                    key={index}
                >
                    <div className={classes.sidebar__item__icon}>{item.icon}</div>
                    <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
                </NavLink>
            ))}
            <Divider/>
            {lowerSlice.map((item, index) => (
                <NavLink
                    to={item.path}
                    onClick={handleOnClick}
                    className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
                    key={index}
                >
                    <div className={classes.sidebar__item__icon}>{item.icon}</div>
                    <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
                </NavLink>
            ))}
            <Credits/>
        </div>
    )
}
