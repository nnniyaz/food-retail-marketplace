"use client";

import React, {useState} from "react";
import Link from "next/link";
import LogoSVG from "@assets/logo.svg";
import PhoneSVG from "@assets/phone.svg";
import MailSVG from "@assets/mail.svg";
import BurgerMenuUpSVG from "@assets/sort-ascending.svg";
import BurgerMenuDownSVG from "@assets/sort-descending.svg";
import classes from "./MobileHeader.module.scss";

export default function MobileHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <header className={classes.mobile_header}>
            {
                isMenuOpen ? (
                    <BurgerMenuUpSVG
                        className={classes.mobile_header__item}
                        onClick={() => setIsMenuOpen(false)}
                    />
                ) : (
                    <BurgerMenuDownSVG
                        className={classes.mobile_header__item}
                        onClick={() => setIsMenuOpen(true)}
                    />
                )
            }
            <Link className={classes.mobile_header__item} href={"/restaurants/en"} rel={"canonical"}>
                <LogoSVG/>
            </Link>
            <div className={classes.mobile_header__item}>
                <div className={classes.mobile_header__item__container}>
                    <a className={classes.mobile__header_group__container__item} href={"tel:+852 6795 4658"}>
                        <PhoneSVG/>
                    </a>
                    <a className={classes.mobile__header_group__container__item} href={"mailto:info@ardogroup.org"}>
                        <MailSVG/>
                    </a>
                </div>
            </div>
        </header>
    )
}
