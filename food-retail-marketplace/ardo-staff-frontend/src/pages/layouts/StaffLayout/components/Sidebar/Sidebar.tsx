import React, {FC, useEffect, useState} from "react";
import {Transition, TransitionStatus} from "react-transition-group";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LogoutOutlined, MenuFoldOutlined} from "@ant-design/icons";
import {IRoute, RouteNames, staffRoutesSidebar} from "@pages//";
import {txt} from "@shared/core/i18ngen";
import {Logo} from "@shared/ui/Logo";
import {Text} from "@shared/ui/Text";
import {Divider} from "@shared/ui/Divider";
import {Credits} from "@shared/ui/Credits";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./Sidebar.module.scss";

interface HeaderProps {
    isShown: boolean;
    setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

const logoutSideBarItem: IRoute = {
    name: txt.logout,
    icon: <LogoutOutlined/>,
    path: "",
    element: <></> as any
}

export const Sidebar: FC<HeaderProps> = ({isShown, setIsShown}) => {
    const navigate = useNavigate();
    const upperSlice = staffRoutesSidebar.filter(item => item.path !== RouteNames.SETTINGS);
    const lowerSlice = staffRoutesSidebar.filter(item => item.path === RouteNames.SETTINGS);
    const {logout} = useActions();

    const [windowSize, setWindowSize] = useState(window.innerWidth);

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

    const handleLogout = async () => {
        logout({navigate});
    }

    useEffect(() => {
        const handleWindowResize = () => setWindowSize(window.innerWidth);

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    if (windowSize <= 1340) {
        return (
            <Transition in={isShown} timeout={300} mountOnEnter unmountOnExit>
                {state => (
                    <div className={`${classes.sidebar} ${transitionClasses[state]}`}>
                        <div className={classes.sidebar__header}>
                            <MenuFoldOutlined className={classes.burger} onClick={() => setIsShown(false)}/>
                            <Logo/>
                        </div>
                        <Divider/>
                        {upperSlice.map((item) => <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>)}
                        <Divider/>
                        {lowerSlice.map((item) => <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>)}
                        <SideBarItem item={logoutSideBarItem} onClick={handleLogout}/>
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
            {upperSlice.map((item) => <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>)}
            <Divider/>
            {lowerSlice.map((item) => <SideBarItem item={item} onClick={handleOnClick} key={item.path}/>)}
            <SideBarItem item={logoutSideBarItem} onClick={handleLogout}/>
            <Credits/>
        </div>
    )
}

const SideBarItem: FC<{ item: IRoute, onClick: (...args: any[]) => void }> = ({item, onClick}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const location = useLocation();
    const activeLink = (path: string) => {
        if (!path) return false;
        if (path === "/") {
            return path === location.pathname;
        }
        return location.pathname.includes(path);
    }

    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            className={activeLink(item.path) ? classes.sidebar__item__active : classes.sidebar__item}
        >
            <div className={classes.sidebar__item__icon}>{item.icon}</div>
            <Text text={item.name[currentLang]} light={activeLink(item.path)}/>
        </NavLink>
    )
}
