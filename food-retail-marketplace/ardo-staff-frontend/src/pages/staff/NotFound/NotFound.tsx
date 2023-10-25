import React, {FunctionComponent} from 'react';
import classes from "./NotFound.module.scss"
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {Translate} from "@features/Translate";

export const NotFound: FunctionComponent = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    return (
        <div className={classes.main}>
            <div className={classes.container}>
                <div className={classes.title}>{`${Translate("page_not_found")} 404`}</div>
                <div className={classes.body}>{Translate("to_main_menu")}</div>
            </div>
        </div>
    );
};
