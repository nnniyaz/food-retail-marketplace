import React, {FC, useState} from "react";
import {Select} from "antd";
import TextArea from "antd/lib/input/TextArea";
import {Langs, MlString} from "@entities/base/MlString";
import {langOptions} from "@shared/lib/options/langOptions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./I18NTextarea.module.scss";

interface I18NTextareaProps {
    value: MlString;
    onChange: (value: MlString) => void;
    placeholder?: string;
}

export const I18NTextarea: FC<I18NTextareaProps> = (props) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const [selectedLang, setSelectedLang] = useState(currentLang || Langs.EN);

    return (
        <div className={classes.i18n_textarea_row_wrapper}>
            <Select
                value={selectedLang}
                onChange={setSelectedLang}
                options={langOptions}
                className={classes.i18n_textarea_select}
            />
            <TextArea
                value={props.value?.[selectedLang]}
                onChange={e => props.onChange({...props.value, [selectedLang]: e.target.value})}
                rows={4}
                placeholder={props.placeholder}
                className={classes.i18n_textarea}
            />
        </div>
    );
};
