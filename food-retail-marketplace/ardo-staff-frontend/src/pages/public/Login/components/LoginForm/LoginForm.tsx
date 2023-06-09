import {FC, useState} from "react";
import {Button, Form} from "antd";
import {txt} from "shared/core/i18ngen";
import {rules} from "shared/lib/form-rules/rules";
import {FormInput} from "shared/ui/FormInput/FormInput";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./LoginForm.module.scss";

export const LoginForm: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <Form className={classes.form} layout={"vertical"}>
            <FormInput
                id={"email"}
                label={txt.email[currentLang]}
                value={email}
                setValue={setEmail}
                rules={[rules.email(txt.please_enter_valid_email[currentLang])]}
                placeholder={txt.enter_email[currentLang]}
            />
            <FormInput
                id={"password"}
                label={txt.password[currentLang]}
                rules={[rules.minmaxLen(txt.password_must_be_at_least_6_and_max_32_characters[currentLang], 6, 32)]}
                value={password}
                setValue={setPassword}
                placeholder={txt.enter_password[currentLang]}
            />
            <Button className={classes.form__btn} size={"large"}>
                <span className={classes.form__btn__text}>
                    {txt.login[currentLang]}
                </span>
            </Button>
        </Form>
    )
}
