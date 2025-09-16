"use client";

import React from "react";
import {usePathname} from "next/navigation";
import {Dropdown, MenuProps} from "antd";
import TranslateSVG from "@assets/translate.svg";
import {Langs} from "@/domain/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import classes from "./LangTab.module.scss";

export default function LangTab() {
    const pathname = usePathname();

    const items: MenuProps["items"] = Object.values(Langs).filter((lang) => lang !== "key").map((lang) => {
        return {
            key: lang,
            label: (
                <a href={pathname?.split("/")?.[0] + "/" + pathname?.split("/")?.[1] + "/" + lang.toLowerCase()}>
                    {translate(lang, lang)}
                </a>
            )
        };
    });

    return (
        <React.Fragment>
            <Dropdown menu={{items}}>
                <div className={classes.lang_tab}>
                    <TranslateSVG/>
                </div>
            </Dropdown>
        </React.Fragment>
    )
}
