import React, {FC} from "react";
import classes from "./RowInfo.module.scss";

interface RowInfoProps {
    label: string;
    value?: string | number | React.ReactNode;
    layout?: "horizontal" | "vertical";
}

export const RowInfo: FC<RowInfoProps> = ({label, value, layout = "horizontal"}) => (
    <div
        className={classes.row__info}
        style={{
            flexDirection: layout === "horizontal" ? "row" : "column",
            alignItems: layout === "horizontal" ? "center" : "flex-start",
            gap: layout === "horizontal" ? "20px" : "10px"
        }}
    >
        <div className={classes.row__info__label}>{label}</div>
        {!!value && (
            <div className={classes.row__info__value}>{value}</div>
        )}
    </div>
);
