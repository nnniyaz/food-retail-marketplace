import React, {FC} from "react";
import {InboxOutlined} from "@ant-design/icons";
import classes from "./Empty.module.scss";
import {useTypedSelector} from "../../lib/hooks/useTypedSelector";
import {txt} from "../../core/i18ngen";

interface EmptyProps {
    text?: string;
}

export const Empty: FC<EmptyProps> = ({text}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    return (
        <div className={classes.empty}>
            <InboxOutlined className={classes.empty__icon}/>
            <p className={classes.empty__text}>{text || txt.no_data[currentLang]}</p>
        </div>
    )
}
