"use client"
import {ReactNode} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Routes} from "@/pkg/routes";
import classes from "@/app/(public)/_components/Footer/Footer.module.scss";

export const NavLink = ({children, href}: { children: ReactNode, href: Routes }) => {
    const pathname = usePathname();
    return (
        <Link
            href={href}
            className={
                pathname === href ? classes.navbar__list_item__link__active : classes.navbar__list_item__link
            }
        >
            {children}
        </Link>
    )
}
