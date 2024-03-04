import {Outlet} from "react-router-dom";
import {Footer} from "@pages/Layout/component/Footer/Footer.tsx";
import classes from "./Layout.module.scss";

export const Layout = () => {
    return (
        <div className={classes.main}>
            <main className={classes.container}>
                <Outlet/>
                <Footer/>
            </main>
        </div>
    )
}
