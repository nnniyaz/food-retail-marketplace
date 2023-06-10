import React, {FC} from "react";
import {Logo} from "shared/ui/Logo";
import {Text} from "shared/ui/Text";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./Header.module.scss"

export const Header: FC = () => {
    const {user} = useTypedSelector(state => state.user);
    const data = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.userType || "",
    }

    return (
        <div className={classes.header}>
            <div className={classes.header__item}>
                <Logo/>
            </div>
            <div className={classes.header__item}>
                <div className={classes.account__block}>
                    <div className={classes.account__avatar}>
                        {`${data.firstName[0]}${data.lastName[0]}`}
                    </div>
                    <div className={classes.account__info}>
                        <Text text={`${data.firstName} ${data.lastName}`} type={"text-small"}/>
                        <Text text={data.role} type={"text-small"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
