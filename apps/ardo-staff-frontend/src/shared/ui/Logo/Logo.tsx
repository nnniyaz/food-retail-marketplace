import React, {FC} from "react";
import classes from "./Logo.module.scss";

export const Logo: FC = () => {
    return (
        <div className={classes.logo}>{"ARDO"}</div>
    )
}
