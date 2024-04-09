import Link from "next/link";
import LogoSVG from "@assets/logo.svg";
import PhoneSVG from "@assets/phone.svg";
import MailSVG from "@assets/mail.svg";
import TruckSVG from "@assets/truck.svg";
import BuildingSVG from "@assets/office-building.svg";
import LoginSVG from "@assets/login.svg";
import {Langs} from "@/domain/mlString/mlString";
import Navbar from "@components/Header/_components/Navbar/Navbar";
import MobileHeader from "@components/Header/_components/MobileHeader/MobileHeader";
import classes from "./Header.module.scss";
import {translate} from "@/pkg/translate/translate";
import {headers} from "next/headers";

export default function Header() {
    const headersList = headers();
    const links = [
        {
            href: "/suppliers/en",
            key: "suppliers",
            role: "link",
            ariaLabel: "Suppliers",
            rel: "canonical",
            label: translate("suppliers", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs),
            icon: <TruckSVG/>
        },
        {
            href: "/restaurants/en",
            key: "restaurants",
            role: "link",
            ariaLabel: "Restaurants",
            rel: "canonical",
            label: translate("restaurants", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs),
            icon: <BuildingSVG/>
        },
        {
            href: process.env.NEXT_PUBLIC_APP_URI + "/profile",
            key: "sign_in",
            role: "link",
            ariaLabel: "Restaurants",
            rel: "external",
            label: translate("sign_in", headersList.get("x-pathname")?.split("/")?.[2]?.toUpperCase() as Langs),
            icon: <LoginSVG/>,
            target: "_blank"
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
            <MobileHeader links={links}/>
        </header>
    );
}
