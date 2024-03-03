import {Link} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import HomeSVG from "@assets/icons/home.svg?react";
import ListSVG from "@assets/icons/list.svg?react";
import CartSVG from "@assets/icons/cart.svg?react";
import HeartSVG from "@assets/icons/heart.svg?react";
import UserSVG from "@assets/icons/user.svg?react";
import classes from "./Footer.module.scss";

export const Footer = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.credentials}>
                <p className={classes.credentials__text}>Ardo Group Ltd.</p>
                <p className={classes.credentials__text}>© 2023. All rights are reserved.</p>
            </div>

            <nav className={classes.navbar}>
                <ul className={classes.navbar__list}>
                    <li className={classes.navbar__list_item}>
                        <Link to={RouteNames.HOME}>
                            <HomeSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link to={RouteNames.CATALOG}>
                            <ListSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link to={RouteNames.CART}>
                            <CartSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link to={RouteNames.FAVOURITES}>
                            <HeartSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link to={RouteNames.PROFILE}>
                            <UserSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
