import React, {useState} from "react";
import * as AntdIcons from "@ant-design/icons";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "@pages/Profile/Profile.module.scss";

const {LoadingOutlined, EyeOutlined, EyeInvisibleOutlined} = AntdIcons;

export const LoginForm = () => {
    const {authError, isLoadingLogin} = useTypedSelector(state => state.userState);
    const {login, setAuthError} = useActions();
    const [userCredentials, setUserCredentials] = useState({email: "", password: ""});
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, email: e.target.value});
        setAuthError({...authError, email: ""});
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, password: e.target.value});
        setAuthError({...authError, password: ""});
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(userCredentials.email, userCredentials.password);
    }

    return (
        <div className={classes.login}>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        <input
                            value={userCredentials.email}
                            onChange={handleEmailChange}
                            placeholder={translate("email")}
                            type={"email"}
                            autoComplete={"email"}
                            required
                        />
                    </label>
                    {!!authError.email && (
                        <div className={classes.error__message}>
                            {authError.email[0].toUpperCase() + authError.email.slice(1)}
                        </div>
                    )}
                </div>
                <div>
                    <label>
                        <input
                            value={userCredentials.password}
                            onChange={handlePasswordChange}
                            placeholder={translate("password")}
                            type={isPasswordVisible ? "text" : "password"}
                            autoComplete={"current-password"}
                            required
                        />
                        {
                            isPasswordVisible
                                ? <EyeInvisibleOutlined onClick={() => setIsPasswordVisible(false)}/>
                                : <EyeOutlined onClick={() => setIsPasswordVisible(true)}/>
                        }
                    </label>
                    {!!authError.password && (
                        <div className={classes.error__message}>
                            {authError.password[0].toUpperCase() + authError.password.slice(1)}
                        </div>
                    )}
                </div>
                <button type={"submit"}>
                    {translate("login")}
                    {(isLoadingLogin) && (
                        <LoadingOutlined className={classes.btn__loading}/>
                    )}
                </button>
            </form>
        </div>
    )
}
