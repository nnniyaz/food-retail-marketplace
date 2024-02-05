import React from "react";
import {Select} from "antd";
import CaretDownSVG from "@/assets/icons/caret-down.svg";
import BellSVG from "@/assets/icons/bell.svg";
import SearchSVG from "@/assets/icons/search.svg";
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

                <div className={classes.notification}>
                    <div className={classes.notification__number}>
                        7
                    </div>
                    <BellSVG className={classes.notification__bell}/>
                </div>
            </div>
            <search>
                <label className={classes.search}>
                    <SearchSVG className={classes.search__icon}/>
                    <input
                        type="text"
                        placeholder="Search in Restolink"
                        className={classes.search__input}
                    />
                </label>
            </search>
        </header>
    )
}
