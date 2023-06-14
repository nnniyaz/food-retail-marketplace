import {FC} from "react";
import classes from "./Credits.module.scss";

export const Credits: FC = () => {
    return (
        <div className={classes.credits}>
            <div className={classes.credits__text}>{"Powered by"}</div>
            <div className={classes.credits__tag}>
                <div className={classes.credits__tag__logo}>{"ARDO"}</div>
            </div>
        </div>
    )
}
