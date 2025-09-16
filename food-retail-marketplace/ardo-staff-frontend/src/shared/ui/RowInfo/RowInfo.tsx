import React, {FC} from "react";
import classes from "./RowInfo.module.scss";

interface RowInfoProps {
    label: string;
    value?: string | number | React.ReactNode;
    layout?: "horizontal" | "vertical";
}

export const RowInfo: FC<RowInfoProps> = ({label, value, layout = "horizontal"}) => (
    <div className={layout === "horizontal" ? classes.row__info : classes.row__info__vertical}>
        <div className={classes.row__info__label}>{label}</div>
        {!!value && (
            <div className={classes.row__info__value}>{value}</div>
        )}
    </div>
);
