import React from "react";
import {Select} from "antd";
import {Search} from "@/app/_ui/Search";
import CaretDownSVG from "@/assets/icons/caret-down.svg";
import CartSVG from "@/assets/icons/cart.svg";
import HeartSVG from "@/assets/icons/heart.svg";
import UserSVG from "@/assets/icons/user.svg";
import BellSVG from "@/assets/icons/bell.svg";
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
                    <div className={classes.nav__item}>
                        <CartSVG className={classes.nav__item__icon}/>
                    </div>
                    <div className={classes.nav__item}>
                        <HeartSVG className={classes.nav__item__icon}/>
                    </div>
                    <div className={classes.nav__item}>
                        <UserSVG className={classes.nav__item__icon}/>
                    </div>
                    <div className={classes.nav__item}>
                        <div className={classes.notification}>
                            <div className={classes.notification__number}>7</div>
                            <BellSVG className={classes.notification__bell}/>
                        </div>
                    </div>
                </nav>

                <div className={classes.notification}>
                    <div className={classes.notification__number}>7</div>
                    <BellSVG className={classes.notification__bell}/>
                </div>
            </div>
            <Search/>
        </header>
    )
}
