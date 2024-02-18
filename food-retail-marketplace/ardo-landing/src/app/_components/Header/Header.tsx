'use client';
import React, {useState} from "react";
import {txt} from '@/app/txt/txt';
import {smoothScroll} from "@/app/utils/scroll/scroll";
import classes from './Header.module.scss';

export default function Header() {
    const [activeTab, setActiveTab] = useState("home");
    const tabs = ["home", "about", "services", "partners", "contacts"];

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        smoothScroll(tab);
    }

    return (
        <header className={classes.header}>
            <div className={classes.credentials}>
                <h1 className={classes.logo}>ARDO</h1>
                <div className={classes.contacts}>
                    <div className={classes.contact__item}></div>
                    <div className={classes.contact__item}></div>
                </div>
            </div>

            <nav className={classes.navbar}>
                <ul className={classes.navbar__list}>
                    {tabs.map(tab => (
                        <li
                            key={tab}
                            className={activeTab === tab ? classes.navbar__item__active : classes.navbar__item}
                            onClick={() => handleTabClick(tab)}
                        >
                            <div className={classes.navbar__circle}></div>
                            <div className={classes.navbar__link}>{txt[tab].EN}</div>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={classes.login__block}>
                <h3 className={classes.login__title}>
                    {txt["account"].EN}
                </h3>
                <p className={classes.login__desc}>
                    {txt["you_can_sign_up_or_if_already_have_an_account_sign_in"].EN}
                </p>
                <div className={classes.btn__bar}>
                    <button className={classes.sign__in__btn}>
                        <a href="#" className={classes.sign__in__link}>
                            {txt["sign_in"].EN}
                        </a>
                    </button>
                    <button className={classes.sign__up__btn}>
                        <a href="#" className={classes.sign__up__link}>
                            {txt["sign_up"].EN}
                        </a>
                    </button>
                </div>
            </div>
        </header>
    )
}
