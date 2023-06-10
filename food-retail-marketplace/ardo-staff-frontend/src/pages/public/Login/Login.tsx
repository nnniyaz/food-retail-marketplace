import React, {FC} from "react";
import {ChangeLang} from "features/ChangeLang";
import {Logo} from "shared/ui/Logo";
import {LoginForm} from "./components/LoginForm";
import classes from "./Login.module.scss";

export const Login: FC = () => {
    return (
        <div className={classes.main}>
            <div className={classes.container}>
                <div className={classes.container__header}>
                    <Logo/>
                    <ChangeLang/>
                </div>
                <LoginForm/>
            </div>
        </div>
    )
}
