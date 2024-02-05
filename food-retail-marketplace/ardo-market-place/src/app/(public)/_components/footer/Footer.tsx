import HomeSVG from "@/assets/icons/home.svg"
import ListSVG from "@/assets/icons/list.svg"
import CartSVG from "@/assets/icons/cart.svg"
import HeartSVG from "@/assets/icons/heart.svg"
import UserSVG from "@/assets/icons/user.svg"
import classes from "./Footer.module.scss";

export const Footer = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.credentials}>
                <p className={classes.credentials__text}>Ardo Group Ltd.</p>
                <p className={classes.credentials__text}>© 2023. All rights are reserved.</p>
            </div>

            <nav className={classes.navbar}>
                <ul className={classes.navbar__list}>
                    <li className={classes.navbar__list_item}>
                        <HomeSVG className={classes.navbar__list_item__icon}/>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <ListSVG className={classes.navbar__list_item__icon}/>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <CartSVG className={classes.navbar__list_item__icon}/>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <HeartSVG className={classes.navbar__list_item__icon}/>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <UserSVG className={classes.navbar__list_item__icon}/>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
