"use client";

import React, {useEffect, useState} from "react";
import {Transition} from "react-transition-group";
import Link from "next/link";
import {usePathname} from "next/navigation";
import LogoSVG from "@assets/logo.svg";
import PhoneSVG from "@assets/phone.svg";
import MailSVG from "@assets/mail.svg";
import BurgerMenuSVG from "@assets/menu.svg";
import LangTab from "@components/Header/_components/LangTab/LangTab";
import classes from "./MobileHeader.module.scss";

interface NavbarProps {
    links: {
        href: string,
        key: string,
        role: string,
        ariaLabel: string,
        rel: string,
        label: string,
        icon?: React.ReactNode,
        target?: string
    }[];
}

export default function MobileHeader(props: NavbarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const transitionClasses = {
        entering: classes.sidebar__container__enter__active,
        entered: classes.sidebar__container__enter__done,
        exiting: classes.sidebar__container__exit__active,
        exited: classes.sidebar__container__exit__done,
        unmounted: classes.sidebar__container__exit__done,
    }

    const closeMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsMenuOpen(false);
    }

    const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMenuOpen]);

    return (
        <React.Fragment>
            <ul className={classes.mobile_header}>
                <li className={classes.mobile_header__item}>
                    <BurgerMenuSVG
                        className={classes.mobile_header__item__icon}
                        onClick={() => setIsMenuOpen(true)}
                    />
                    <LogoSVG/>
                </li>
                <li className={classes.mobile_header__item}>
                    <div className={classes.mobile_header__item__container}>
                        <a className={classes.mobile_header_group__container__item} href={"tel:+852 6795 4658"}>
                            <PhoneSVG/>
                        </a>
                        <a className={classes.mobile_header_group__container__item} href={"mailto:info@ardogroup.org"}>
                            <MailSVG/>
                        </a>
                        <LangTab/>
                    </div>
                </li>
            </ul>
            <Transition in={isMenuOpen} timeout={300} mountOnEnter unmountOnExit>
                {state => (
                    <div className={`${classes.sidebar__container} ${transitionClasses[state]}`} onClick={closeMenu}>
                        <section className={classes.sidebar} onClick={handleSidebarClick}>
                            <header className={classes.sidebar__header}>
                                <BurgerMenuSVG
                                    className={classes.sidebar__header__item}
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <LogoSVG/>
                            </header>
                            <ul>
                                {
                                    props.links.map(link => (
                                        <li key={link.key}>
                                            <Link
                                                className={pathname === link.href ? classes.sidebar__item__active : classes.sidebar__item}
                                                href={link.href}
                                                key={link.key}
                                                role={link.role}
                                                aria-label={link.ariaLabel}
                                                rel={link.rel}
                                                target={link.target}
                                            >
                                                {link.icon}
                                                <p className={classes.sidebar__item__text}>
                                                    {link.label}
                                                </p>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                    </div>
                )}
            </Transition>
        </React.Fragment>
    )
}
