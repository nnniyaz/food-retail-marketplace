import React from "react";
import {Link} from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import ArrorSVG from "@assets/icons/caret-right.svg?react";
import {RouteNames} from "@pages/index.tsx";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {txts} from "../../../../../server/pkg/core/txts.ts";
import classes from "./Account.module.scss";

const {EditOutlined} = AntdIcons;

export const Account = () => {
    const {currentLang} = useTypedSelector(state => state.systemState);
    const {user} = useTypedSelector(state => state.userState);
    const profileRoutes = [
        {name: txts.delivery_addresses[currentLang], path: RouteNames.ADDRESS},
        {name: txts.order_history[currentLang], path: RouteNames.ORDERS},
        {name: txts.favourite_products[currentLang], path: RouteNames.FAVOURITES},
    ];

    if (!user) {
        return null;
    }
    return (
        <React.Fragment>
            <div className={classes.account}>
                <section className={classes.account__info}>
                    <div className={classes.account__preview}>
                        {`${user.firstName[0]}${user.lastName[0]}`}
                    </div>
                    <div className={classes.account__info__layers}>
                        <h1 className={classes.account__info__name}>
                            {`${user.firstName} ${user.lastName}`}
                        </h1>
                        <Link className={classes.account__info__link} to={RouteNames.SETTINGS}>
                            {txts.edit[currentLang]}
                            <EditOutlined />
                        </Link>
                    </div>
                </section>
                <ul className={classes.account__menu__bar}>
                    {profileRoutes.map(route => (
                        <li>
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
