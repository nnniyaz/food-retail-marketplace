import Header from "@components/Header/Header";
import classes from './page.module.scss';

export default function Main() {
    return (
        <main className={classes.main}>
            <div className={classes.container}>
                <Header/>
                restaurants
            </div>
        </main>
    );
}
