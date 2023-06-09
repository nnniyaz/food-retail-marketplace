import {ChangeLang} from "features/ChangeLang";
import {LoginForm} from "./components/LoginForm";
import classes from "./Login.module.scss";

export function Login() {
    return (
        <div className={classes.main}>
            <div className={classes.container}>
                <div className={classes.container__header}>
                    <div className={classes.logo}>{"ARDO"}</div>
                    <ChangeLang/>
                </div>
                <LoginForm/>
            </div>
        </div>
    )
}
