import React, {FC} from "react";
import {Outlet} from "react-router-dom";
import classes from "./Layout.module.scss";

export const Layout: FC = () => {
    return (
        <div className={classes.layout}>
            <Outlet/>
        </div>
    )
}
