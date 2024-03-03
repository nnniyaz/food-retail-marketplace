import React from "react";
import {Footer} from "@pages/Layout/component/Footer/Footer.tsx";
import classes from "./Layout.module.scss";

export const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className={classes.main}>
            <main className={classes.container}>
                {children}
                <Footer/>
            </main>
        </div>
    )
}
