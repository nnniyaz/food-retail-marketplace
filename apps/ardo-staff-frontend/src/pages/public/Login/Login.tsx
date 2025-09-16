import React, {FC} from "react";
import {ChangeLang} from "@features/ChangeLang";
import {Logo} from "@shared/ui/Logo";
import {Loader} from "@shared/ui/Loader";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {LoginForm} from "./components/LoginForm";
import classes from "./Login.module.scss";

export const Login: FC = () => {
    const {isLoadingGetUser} = useTypedSelector(state => state.user);

    return (
        <div className={classes.main}>
            {isLoadingGetUser
                ?
                <Loader/>
                :
                <div className={classes.container}>
                    <div className={classes.container__header}>
                        <Logo/>
                        <ChangeLang/>
                    </div>
                    <LoginForm/>
                </div>
            }
        </div>
    )
}
