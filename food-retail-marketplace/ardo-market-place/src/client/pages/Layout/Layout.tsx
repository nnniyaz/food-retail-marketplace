import {Outlet} from "react-router-dom";
import {Header} from "@pages/Layout/component/Header/Header.tsx";
import {Footer} from "@pages/Layout/component/Footer/Footer.tsx";
import classes from "./Layout.module.scss";

export const Layout = () => {
    return (
        <div className={classes.main}>
            <main className={classes.container}>
                <Header/>
                <Outlet/>
                <Footer/>
            </main>
        </div>
    )
}
