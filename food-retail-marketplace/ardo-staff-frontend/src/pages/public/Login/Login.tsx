import React, {FC, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ChangeLang} from "features/ChangeLang";
import {Logo} from "shared/ui/Logo";
import {Loader} from "shared/ui/Loader";
import {useActions} from "shared/lib/hooks/useActions";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {LoginForm} from "./components/LoginForm";
import classes from "./Login.module.scss";
import {RouteNames} from "../../index";

export const Login: FC = () => {
    const navigate = useNavigate();
    const {isLoadingGetUser} = useTypedSelector(state => state.user);
    const {getCurrentUser} = useActions();

    useEffect(() => {
        getCurrentUser({navigate: navigate, to: RouteNames.LOGIN}, true);
    }, []);

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
