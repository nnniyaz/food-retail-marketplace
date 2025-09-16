import React, {FC} from "react";
import {Button, Input} from "antd";
import {txt} from "@shared/core/i18ngen";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./TableHeader.module.scss";

interface TableHeaderProps {
    searchPlaceholder?: string;
    onSearch?: (...args: any[]) => void;
    onSearchText?: string;
    onSubButtonClick?: (...args: any[]) => void;
    onSubButtonText?: string;
}

export const TableHeader: FC<TableHeaderProps> = (props) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    return (
        <div className={classes.table__header}>
            <Input placeholder={props.searchPlaceholder}/>
            <Button className={classes.table__header__btn} onClick={props.onSearch}>
                {props.onSearchText || txt.search[currentLang]}
            </Button>
            {props.onSubButtonClick && (
                <Button className={classes.table__header__btn} onClick={props.onSubButtonClick} type={"primary"}>
                    {props.onSubButtonText || txt.add[currentLang]}
                </Button>
            )}
        </div>
    );
};
