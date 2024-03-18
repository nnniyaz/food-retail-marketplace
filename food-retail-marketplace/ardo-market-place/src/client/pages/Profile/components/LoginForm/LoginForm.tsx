import React, {useState} from "react";
import * as AntdIcons from "@ant-design/icons";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {txts} from "../../../../../server/pkg/core/txts.ts";
import classes from "@pages/Profile/Profile.module.scss";

const {LoadingOutlined, EyeOutlined, EyeInvisibleOutlined} = AntdIcons;

export const LoginForm = () => {
    const {currentLang} = useTypedSelector(state => state.systemState);
    const {authError, isLoadingLogin} = useTypedSelector(state => state.userState);
    const {login} = useActions();
    const [userCreds, setUserCreds] = useState({email: "", password: ""});
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCreds({...userCreds, email: e.target.value});
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCreds({...userCreds, password: e.target.value});
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(userCreds.email, userCreds.password);
    }

    return (
        <div className={classes.login}>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        <input
                            value={userCreds.email}
                            onChange={handleEmailChange}
                            placeholder={txts.email[currentLang]}
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
                            value={userCreds.password}
                            onChange={handlePasswordChange}
                            placeholder={txts.password[currentLang]}
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
                    {txts.login[currentLang]}
                    {(isLoadingLogin) && (
                        <LoadingOutlined className={classes.btn__loading}/>
                    )}
                </button>
            </form>
        </div>
    )
}
