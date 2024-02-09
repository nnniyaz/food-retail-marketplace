import {NavLink} from "@/app/_ui/NavLink";
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
                        <NavLink href={Routes.HOME}>
                            <HomeSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink href={Routes.CATALOG}>
                            <ListSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink href={Routes.CART}>
                            <CartSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink href={Routes.FAVOURITES}>
                            <HeartSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink href={Routes.PROFILE}>
                            <UserSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
