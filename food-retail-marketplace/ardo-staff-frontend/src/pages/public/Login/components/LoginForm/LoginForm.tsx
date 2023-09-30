import {FC, useEffect, useState} from "react";
import {Button, Form} from "antd";
import {useNavigate} from "react-router-dom";
import {RouteNames} from "pages/index";
import {txt} from "shared/core/i18ngen";
import {rules} from "shared/lib/form-rules/rules";
import {FormInput} from "shared/ui/FormInput/FormInput";
import {useActions} from "shared/lib/hooks/useActions";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./LoginForm.module.scss";

export const LoginForm: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAuth} = useTypedSelector(state => state.auth);
    const {login} = useActions();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleLogin = () => {
        login({email, password}, {navigate: navigate, to: RouteNames.LOGIN});
    }

    return (
        <Form className={classes.form} layout={"vertical"} onFinish={handleLogin} name={"form"}>
            <FormInput
                id={"email"}
                label={txt.email[currentLang]}
                value={email}
                setValue={setEmail}
                rules={[
                    rules.required(txt.please_enter_email[currentLang]),
                    rules.email(txt.please_enter_valid_email[currentLang])
                ]}
                placeholder={txt.enter_email[currentLang]}
            />
            <FormInput
                id={"password"}
                label={txt.password[currentLang]}
                rules={[
                    rules.required(txt.please_enter_password[currentLang]),
                    rules.minmaxLen(txt.password_must_be_at_least_6_and_max_32_characters[currentLang], 6, 32)
                ]}
                type={"password"}
                value={password}
                setValue={setPassword}
                placeholder={txt.enter_password[currentLang]}
            />
            <Form.Item style={{margin: "0", width: "100%"}}>
                <Button
                    loading={isLoadingAuth}
                    className={classes.form__btn}
                    type={"primary"}
                    size={"large"}
                    htmlType={"submit"}
                >
                    <span className={classes.form__btn__text}>{txt.login[currentLang]}</span>
                </Button>
            </Form.Item>
        </Form>
    )
}
