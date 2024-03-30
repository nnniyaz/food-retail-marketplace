import React from "react";
import {Link} from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import ArrorSVG from "@assets/icons/caret-right.svg?react";
import {RouteNames} from "@pages/index.tsx";
import {translate} from "@pkg/translate/translate";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Account.module.scss";
import {phoneFormat} from "@pkg/formats/phone/phoneFormat.ts";

const {EditOutlined} = AntdIcons;

export const Account = () => {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {user} = useTypedSelector(state => state.userState);
    const profileRoutes = [
        {name: translate("delivery_addresses", currentLang, langs), path: RouteNames.ADDRESS},
        {name: translate("order_history", currentLang, langs), path: RouteNames.ORDERS},
        {name: translate("favourite_products", currentLang, langs), path: RouteNames.FAVOURITES},
    ];

    if (!user) {
        return null;
    }
    return (
        <React.Fragment>
            <div className={classes.account}>
                <section className={classes.account__info}>
                    <div className={classes.account__info__group}>
                        <div className={classes.account__preview}>
                            {`${user.firstName[0]}${user.lastName[0]}`}
                        </div>
                        <Link className={classes.account__info__link} to={RouteNames.SETTINGS}>
                            {translate("edit", currentLang, langs)}
                            <EditOutlined />
                        </Link>
                    </div>
                    <div className={classes.account__info__group}>
                        <h1 className={classes.account__info__name}>
                            {`${user.firstName} ${user.lastName}`}
                        </h1>
                        <div className={classes.account__info__credentials}>
                            <div className={classes.account__info__credentials__item}>
                                <p className={classes.account__info__credentials__item__label}>
                                    {translate("email", currentLang, langs)}
                                </p>
                                <p className={classes.account__info__credentials__item__value}>
                                    {user.email}
                                </p>
                            </div>
                            <div className={classes.account__info__credentials__item}>
                                <p className={classes.account__info__credentials__item__label}>
                                    {translate("phone", currentLang, langs)}
                                </p>
                                <p className={classes.account__info__credentials__item__value}>
                                    {phoneFormat(user.phone.number, user.phone.countryCode) || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <ul className={classes.account__menu__bar}>
                    {profileRoutes.map(route => (
                        <li key={route.path}>
                            <Link className={classes.account__menu__bar__item} to={route.path}>
                                {route.name}
                                <ArrorSVG/>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </React.Fragment>
    )
}
