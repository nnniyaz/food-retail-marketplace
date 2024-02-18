import LogoSVG from "@/app/assets/logo.svg";
import LogoSmallSVG from "@/app/assets/logo-small.svg";
import classes from "./Footer.module.scss";

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    <LogoSVG className={classes.logo__default}/>
                    <LogoSmallSVG className={classes.logo__small}/>
                </div>
                <div className={classes.credentials__block}>
                    <h3 className={classes.credentials__title}>
                        Contact with us.
                    </h3>
                    <p className={classes.credentials__desc}>lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <div className={classes.credentials}>
                        <div className={classes.credentials__column}>
                            <h4 className={classes.credentials__column__title}>
                                <span className={classes.credentials__column__title__dot}></span>
                                Social media
                            </h4>
                            <ul className={classes.credentials__column__list}>
                                <li className={classes.credentials__column__list__item}>Instagram</li>
                                <li className={classes.credentials__column__list__item}>Telegram</li>
                                <li className={classes.credentials__column__list__item}>WhatsApp</li>
                            </ul>
                        </div>

                        <div className={classes.credentials__column}>
                            <h4 className={classes.credentials__column__title}>
                                <span className={classes.credentials__column__title__dot}></span>
                                Social media
                            </h4>
                            <ul className={classes.credentials__column__list}>
                                <li className={classes.credentials__column__list__item}>Instagram</li>
                                <li className={classes.credentials__column__list__item}>Telegram</li>
                                <li className={classes.credentials__column__list__item}>WhatsApp</li>
                            </ul>
                        </div>

                        <div className={classes.credentials__column}>
                            <h4 className={classes.credentials__column__title}>
                                <span className={classes.credentials__column__title__dot}></span>
                                Social media
                            </h4>
                            <ul className={classes.credentials__column__list}>
                                <li className={classes.credentials__column__list__item}>Instagram</li>
                                <li className={classes.credentials__column__list__item}>Telegram</li>
                                <li className={classes.credentials__column__list__item}>WhatsApp</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
