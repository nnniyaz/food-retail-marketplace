import {NavLink, useLocation} from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import {RouteNames} from "@pages/index.tsx";
import HomeSVG from "@assets/icons/home.svg?react";
import SearchSVG from "@assets/icons/search.svg?react";
import CartSVG from "@assets/icons/cart.svg?react";
// import ShoppingBagSVG from "@assets/icons/shopping-bag.svg?react";
import UserSVG from "@assets/icons/user.svg?react";
import classes from "./Footer.module.scss";
import {translate} from "@pkg/translate/translate.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

const {WhatsAppOutlined} = AntdIcons;

export const Footer = () => {
    const location = useLocation();
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    return (
        <footer className={classes.footer}>
            {
                (location.pathname !== RouteNames.CART && location.pathname !== RouteNames.CHECKOUT) && (
                    <div className={classes.credentials}>
                        <a
                            href={"https://wa.link/vnrfq1"}
                            target={"_blank"}
                            className={classes.credentials__text} style={{marginBottom: "5px", color: "#4096ff"}}
                        >
                            <WhatsAppOutlined />
                            {translate("customer_service", currentLang, langs)}
                        </a>
                        <p className={classes.credentials__text}>
                            <a
                                className={classes.credentials__link}
                                href={"https://ardogroup.org/suppliers/en#faq"}
                                target={"_blank"}
                            >
                                FAQ
                            </a>
                            <span>|</span>
                            <a
                                className={classes.credentials__link}
                                href={"https://ardogroup.org/terms-of-use/en"}
                                target={"_blank"}
                            >
                                Terms of use
                            </a>
                            <span>|</span>
                            <a
                                className={classes.credentials__link}
                                href={"https://ardogroup.org/terms-and-conditions/en"}
                                target={"_blank"}
                            >
                                Terms and Conditions
                            </a>
                        </p>
                        <p className={classes.credentials__text}>Ardo Group Ltd.</p>
                        <p className={classes.credentials__text}>© 2023. All rights are reserved.</p>
                    </div>
                )
            }

            <nav className={classes.navbar}>
                <ul className={classes.navbar__list}>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.HOME}
                            className={location.pathname === RouteNames.HOME
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <HomeSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.CATALOG}
                            className={location.pathname === RouteNames.CATALOG
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <SearchSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.CART}
                            className={location.pathname === RouteNames.CART
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <CartSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                    {/*<li className={classes.navbar__list_item}>*/}
                    {/*    <NavLink*/}
                    {/*        to={RouteNames.FAVOURITES}*/}
                    {/*        className={location.pathname === RouteNames.FAVOURITES*/}
                    {/*            ? classes.navbar__list_item__link__active*/}
                    {/*            : classes.navbar__list_item__link*/}
                    {/*        }*/}
                    {/*    >*/}
                    {/*        <ShoppingBagSVG className={classes.navbar__list_item__icon}/>*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                    <li className={classes.navbar__list_item}>
                        <NavLink
                            to={RouteNames.PROFILE}
                            className={location.pathname === RouteNames.PROFILE
                                ? classes.navbar__list_item__link__active
                                : classes.navbar__list_item__link
                            }
                        >
                            <UserSVG className={classes.navbar__list_item__icon}/>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}
