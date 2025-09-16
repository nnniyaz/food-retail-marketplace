import {Outlet} from "react-router-dom";
import {Header} from "@pages/Layout/component/Header/Header.tsx";
import {Footer} from "@pages/Layout/component/Footer/Footer.tsx";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Layout.module.scss";

export const Layout = () => {
    const {isLoadingGetUser} = useTypedSelector(state => state.userState);

    if (isLoadingGetUser) {
        return (
            <div className={classes.main}>
                <main className={classes.container}>
                    <Header/>
                    <Footer/>
                </main>
            </div>
        );
    }
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
