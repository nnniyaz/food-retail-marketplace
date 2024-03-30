import React from "react";
import classes from "./Settings.module.scss";
import {translate} from "@pkg/translate/translate.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

export const Settings = () => {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {user} = useTypedSelector(state => state.userState);
    return (
        <React.Fragment>
            <div className={classes.checkout__info__group}>
                <div className={classes.checkout__info__row}>
                    <p className={classes.checkout__info__row__label}>
                        {translate("receiver", currentLang, langs)}
                    </p>
                    <p className={classes.checkout__info__row__value}>
                        {`${user.firstName} ${user.lastName}`}
                    </p>
                </div>
                <div className={classes.checkout__info__row}>
                    <p className={classes.checkout__info__row__label}>
                        {translate("email", currentLang, langs)}
                    </p>
                    <p className={classes.checkout__info__row__value}>
                        {user.email || "-"}
                    </p>
                </div>
                <div className={classes.checkout__info__row}>
                    <p className={classes.checkout__info__row__label}>
                        {translate("phone", currentLang, langs)}
                    </p>
                    <p className={classes.checkout__info__row__value}>
                        {(!!user.phone?.countryCode && !!user.phone?.number) ? `${user.phone.countryCode} ${user.phone.number}` : "-"}
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}
