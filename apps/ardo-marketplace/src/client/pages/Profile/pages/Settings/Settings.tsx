import React from "react";
import classes from "./Settings.module.scss";
import {translate} from "@pkg/translate/translate.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {countryCodesInfo} from "@pkg/formats/phone/countryCodes.ts";
import {phoneFormat} from "@pkg/formats/phone/phoneFormat.ts";
import {ReturnButton} from "@widgets/ReturnButton";
import {RouteNames} from "@pages/index.tsx";

export const Settings = () => {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {user} = useTypedSelector(state => state.userState);
    return (
        <React.Fragment>
            <ReturnButton
                to={RouteNames.PROFILE}
                title={translate("settings", currentLang, langs)}
            />

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
                        {(!!user.phone?.countryCode && !!user.phone?.number) ? `${countryCodesInfo[user.phone.countryCode].dial_code} ${phoneFormat(user.phone.number, user.phone.countryCode)}` : "-"}
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}
