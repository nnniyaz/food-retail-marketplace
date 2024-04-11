"use client";

import React from "react";
import Link from "next/link";
import {Langs} from "@/domain/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import FormModal from "@components/FormModal/FormModal";
import classes from './ButtonForm.module.scss';

interface ButtonFormProps {
    lang: Langs
    isSupplierPage: boolean
}

export default function ButtonForm({lang, isSupplierPage}: ButtonFormProps) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const handleButtonClick = () => {
        if (isSupplierPage) {

        }
    }

    return (
        <React.Fragment>
            {
                isSupplierPage ? (
                    <button className={classes.button} onClick={() => setIsOpen(true)}>
                        {translate("get_started", lang)}
                    </button>
                ) : (
                    <Link
                        className={classes.button}
                        href={process.env.NEXT_PUBLIC_APP_URI + "/profile"}
                        key={"sign_in"}
                        role={"link"}
                        aria-label={"Restaurants"}
                        rel={"external"}
                        target={"_blank"}
                    >
                        {translate("get_started", lang)}
                    </Link>
                )
            }
            <FormModal lang={lang} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </React.Fragment>
    )
}
