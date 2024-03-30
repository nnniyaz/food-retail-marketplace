import {Link} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import HomeSVG from "@assets/icons/home.svg?react";
import ListSVG from "@assets/icons/list.svg?react";
import CartSVG from "@assets/icons/cart.svg?react";
import HeartSVG from "@assets/icons/heart.svg?react";
import UserSVG from "@assets/icons/user.svg?react";
import LogoSVG from "@assets/icons/logo.svg?react";
// import BellSVG from "@assets/icons/bell.svg?react";
import classes from "./Header.module.scss";

export const Header = () => {
    return (
        <header className={classes.header}>
            <div className={classes.header__row}>
                <a className={classes.logo} href={"https://ardogroup.org"} target={"_blank"} rel={"re"}>
                    <LogoSVG style={{width: "40px", height: "40px"}}/>
                    <span>ARDO</span>
                </a>

                <nav className={classes.navbar}>
                    <Link className={classes.nav__item} to={RouteNames.HOME}>
                        <HomeSVG className={classes.nav__item__icon}/>
                    </Link>
                    <Link className={classes.nav__item} to={RouteNames.CATALOG}>
                        <ListSVG className={classes.nav__item__icon}/>
                    </Link>
                    <Link className={classes.nav__item} to={RouteNames.CART}>
                        <CartSVG className={classes.nav__item__icon}/>
                    </Link>
                    <Link className={classes.nav__item} to={RouteNames.FAVOURITES}>
                        <HeartSVG className={classes.nav__item__icon}/>
                    </Link>
                    <Link className={classes.nav__item} to={RouteNames.PROFILE}>
                        <UserSVG className={classes.nav__item__icon}/>
                    </Link>
                    {/*<div className={classes.nav__item}>*/}
                    {/*    <div className={classes.notification}>*/}
                    {/*        <div className={classes.notification__number}>7</div>*/}
                    {/*        <BellSVG className={classes.notification__bell}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </nav>

                {/*<div className={classes.notification}>*/}
                {/*    <div className={classes.notification__number}>7</div>*/}
                {/*    <BellSVG className={classes.notification__bell}/>*/}
                {/*</div>*/}
            </div>
        </header>
    )
}
