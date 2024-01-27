import React, {FC, useState} from "react";
import {Input, Select} from "antd";
import {Lang, MlString} from "@entities/base/MlString";
import {langOptions} from "@shared/lib/options/langOptions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./I18NInput.module.scss";

interface I18NInputProps {
    value: MlString;
    onChange: (value: MlString) => void;
    placeholder?: string;
}

export const I18NInput: FC<I18NInputProps> = (props) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const [selectedLang, setSelectedLang] = useState(currentLang || Lang.EN);

    return (
        <div className={classes.i18n_input_row_wrapper}>
            <Select
                value={selectedLang}
                onChange={setSelectedLang}
                options={langOptions}
                className={classes.i18n_input_select}
            />
            <Input
                value={props.value?.[selectedLang]}
                onChange={e => props.onChange({...props.value, [selectedLang]: e.target.value})}
                placeholder={props.placeholder}
                className={classes.i18n_input}
            />
        </div>
    );
};
