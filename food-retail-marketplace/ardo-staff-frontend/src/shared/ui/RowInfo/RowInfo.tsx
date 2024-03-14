import React, {FC} from "react";
import classes from "./RowInfo.module.scss";

export const RowInfo: FC<{ label: string, value: string }> = ({label, value}) => (
    <div className={classes.row__info}>
        <div className={classes.row__info__label}>{label}</div>
        <div className={classes.row__info__value}>{value}</div>
    </div>
);
