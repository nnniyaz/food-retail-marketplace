import React, {FC} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import classes from "./Loader.module.scss";

interface LoaderProps {
    size?: number;
}

export const Loader: FC<LoaderProps> = ({size}) => {
    return (
        <LoadingOutlined style={{fontSize: `${size}px` || "30px"}} className={classes.loader}/>
    )
}
