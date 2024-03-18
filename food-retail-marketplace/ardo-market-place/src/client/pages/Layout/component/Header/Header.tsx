import {Select} from "antd";
import {Link} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import CaretDownSVG from "@assets/icons/caret-down.svg?react";
import HomeSVG from "@assets/icons/home.svg?react";
import ListSVG from "@assets/icons/list.svg?react";
import CartSVG from "@assets/icons/cart.svg?react";
import HeartSVG from "@assets/icons/heart.svg?react";
import UserSVG from "@assets/icons/user.svg?react";
// import BellSVG from "@assets/icons/bell.svg?react";
import classes from "./Header.module.scss";

export const Header = () => {
    return (
        <header className={classes.header}>
            <div className={classes.header__row}>
                <label className={classes.address}>
                    Address
                    <Select
                        className={classes.select}
                        value={"Kowloon Tong, Renfrew Rd, 34"}
                        options={[
                            {value: "Kowloon Tong, Renfrew Rd, 34", label: "Kowloon Tong, Renfrew Rd, 34"},
                            {value: "Kowloon Tong, Renfrew Rd, 35", label: "Kowloon Tong, Renfrew Rd, 35"},
                            {value: "Kowloon Tong, Renfrew Rd, 36", label: "Kowloon Tong, Renfrew Rd, 36"},
                        ]}
                        suffixIcon={<CaretDownSVG className={classes.select__icon}/>}
                    />
                </label>

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
