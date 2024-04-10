"use client";

import React from "react";
import {Langs} from "@/domain/mlString/mlString";
import {translate} from "@/pkg/translate/translate";
import FormModal from "@components/FormModal/FormModal";
import classes from './ButtonForm.module.scss';

interface ButtonFormProps {
    lang: Langs
}

export default function ButtonForm({lang}: ButtonFormProps) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    return (
        <React.Fragment>
            <button className={classes.button} onClick={() => setIsOpen(true)}>
                {translate("get_started", lang)}
            </button>
            <FormModal lang={lang} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </React.Fragment>
    )
}
