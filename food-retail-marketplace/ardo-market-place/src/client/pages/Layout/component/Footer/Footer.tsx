import {NavLink, useLocation} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import HomeSVG from "@assets/icons/home.svg?react";
import ListSVG from "@assets/icons/list.svg?react";
import CartSVG from "@assets/icons/cart.svg?react";
import HeartSVG from "@assets/icons/heart.svg?react";
import UserSVG from "@assets/icons/user.svg?react";
import classes from "./Footer.module.scss";

export const Footer = () => {
    const location = useLocation();
    return (
        <footer className={classes.footer}>
            <div className={classes.credentials}>
                <p className={classes.credentials__text}>Ardo Group Ltd.</p>
                <p className={classes.credentials__text}>© 2023. All rights are reserved.</p>
            </div>

            <nav className={classes.navbar}>
                <ul className={classes.navbar__list}>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.HOME}
                            className={location.pathname === RouteNames.HOME
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <HomeSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.CATALOG}
                            className={location.pathname === RouteNames.CATALOG
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <ListSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.CART}
                            className={location.pathname === RouteNames.CART
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <CartSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.FAVOURITES}
                            className={location.pathname === RouteNames.FAVOURITES
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <HeartSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.PROFILE}
                            className={location.pathname === RouteNames.PROFILE
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <UserSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
