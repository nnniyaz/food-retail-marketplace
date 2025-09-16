import React from "react";
import * as AntdIcons from "@ant-design/icons";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {Account} from "@pages/Profile/components/Account";
import {LoginForm} from "@pages/Profile/components/LoginForm";
import classes from "./Profile.module.scss";

const {LoadingOutlined} = AntdIcons;

export const Profile = () => {
    const {isAuth, isLoadingGetUser, isLoadingLogout} = useTypedSelector(state => state.userState);

    return (
        <React.Fragment>
            {
                isLoadingGetUser || isLoadingLogout
                    ?
                    <div className={classes.login}>
                        <LoadingOutlined className={classes.btn__loading} style={{fontSize: "30px"}}/>
                    </div>
                    :
                    isAuth ? <Account/> : <LoginForm/>
            }
        </React.Fragment>
    );
}
