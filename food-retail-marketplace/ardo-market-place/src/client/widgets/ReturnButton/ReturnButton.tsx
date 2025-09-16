import {Link} from "react-router-dom";
import ArrowCircleLeftSVG from "@assets/icons/arrow-circle-left.svg?react";
import classes from "./ReturnButton.module.scss";

interface ReturnButtonProps {
    to: string;
    title?: string;
}

export const ReturnButton = ({to, title}: ReturnButtonProps) => {
    return (
        <Link to={to} className={classes.return_button}>
            <ArrowCircleLeftSVG className={classes.return_button__icon}/>
            <h1>{title || "Вернуться назад"}</h1>
        </Link>
    );
}
