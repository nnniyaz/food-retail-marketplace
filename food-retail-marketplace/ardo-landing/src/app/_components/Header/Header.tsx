import React from "react";
import Link from "next/link";
import LogoSVG from "@assets/logo.svg";
import PhoneSVG from "@assets/phone.svg";
import MailSVG from "@assets/mail.svg";
import Navbar from "@components/Header/_components/Navbar/Navbar";
import classes from "./Header.module.scss";

export default function Header() {
    const links = [
        {
            href: "/restaurants/en",
            key: "restaurants",
            role: "link",
            ariaLabel: "Restaurants",
            rel: "canonical",
            label: "Restaurants"
        },
        {
            href: "/suppliers/en",
            key: "suppliers",
            role: "link",
            ariaLabel: "Suppliers",
            rel: "canonical",
            label: "Suppliers"
        },
    ];
    return (
        <header className={classes.header}>
            <div className={classes.header_group}>
                <Link
                    className={classes.header_group__logo__link}
                    href={"/restaurants/en"}
                    rel={"canonical"}
                >
                    <LogoSVG/>
                </Link>
                <div className={classes.header_group__container}>
                    <a className={classes.header_group__container__item} href={"tel:+852 6795 4658"}>
                        <PhoneSVG/>
                    </a>
                    <a className={classes.header_group__container__item} href={"mailto:info@ardogroup.org"}>
                        <MailSVG/>
                    </a>
                </div>
            </div>
            <Navbar links={links}/>
        </header>
    );
}
