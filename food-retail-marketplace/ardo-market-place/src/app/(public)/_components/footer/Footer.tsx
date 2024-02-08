import Link from "next/link";
import {Routes} from "@/pkg/routes";
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
                        <Link href={Routes.HOME} className={classes.navbar__list_item__link}>
                            <HomeSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link href={Routes.CATALOG} className={classes.navbar__list_item__link}>
                            <ListSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link href={Routes.CART} className={classes.navbar__list_item__link}>
                            <CartSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link href={Routes.FAVOURITES} className={classes.navbar__list_item__link}>
                            <HeartSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <Link href={Routes.PROFILE} className={classes.navbar__list_item__link}>
                            <UserSVG className={classes.navbar__list_item__icon}/>
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
