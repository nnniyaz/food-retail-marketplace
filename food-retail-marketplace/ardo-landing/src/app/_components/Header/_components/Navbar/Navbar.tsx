"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import classes from "./Navbar.module.scss";

interface NavbarProps {
    links: {
        href: string,
        key: string,
        role: string,
        ariaLabel: string,
        rel: string,
        label: string
    }[];
}

export default function Navbar(props: NavbarProps) {
    const pathname = usePathname();
    return (
        <nav className={classes.navbar}>
            {
                props.links.map(link => (
                    <Link
                        className={pathname === link.href ? classes.navbar_item__active : classes.navbar_item}
                        href={link.href}
                        key={link.key}
                        role={link.role}
                        aria-label={link.ariaLabel}
                        rel={link.rel}
                    >
                        <p className={classes.navbar__item__text}>
                            {link.label}
                        </p>
                    </Link>
                ))
            }
        </nav>
    );
}
