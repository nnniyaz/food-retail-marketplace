import React from "react";
import Header from "@components/Header/Header";
import classes from './page.module.scss';

export default function Main() {
    return (
        <main className={classes.main}>
            <div className={classes.container}>
                <Header/>
                suppliers
            </div>
        </main>
    );
}
