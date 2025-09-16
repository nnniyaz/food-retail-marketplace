import {Link} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import HomeSVG from "@assets/icons/home.svg?react";
import SearchSVG from "@assets/icons/search.svg?react";
import CartSVG from "@assets/icons/cart.svg?react";
// import ShoppingBagSVG from "@assets/icons/shopping-bag.svg?react";
import UserSVG from "@assets/icons/user.svg?react";
import LogoSVG from "@assets/icons/logo.svg?react";
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
                        <SearchSVG className={classes.nav__item__icon}/>
                    </Link>
                    <Link className={classes.nav__item} to={RouteNames.CART}>
                        <CartSVG className={classes.nav__item__icon}/>
                    </Link>
                    {/*<Link className={classes.nav__item} to={RouteNames.FAVOURITES}>*/}
                    {/*    <ShoppingBagSVG className={classes.nav__item__icon}/>*/}
                    {/*</Link>*/}
                    <Link className={classes.nav__item} to={RouteNames.PROFILE}>
                        <UserSVG className={classes.nav__item__icon}/>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
