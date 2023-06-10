import React, {FC} from "react";
import {Outlet} from "react-router-dom";
import {Header} from "./components/Header";
import {Sidebar} from "./components/Sidebar";
import classes from "./StaffLayout.module.scss";

export const StaffLayout: FC = () => {
    return (
        <div className={classes.layout}>
            <Header/>
            <div className={classes.body}>
                <Sidebar/>
                <div className={classes.content}>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
