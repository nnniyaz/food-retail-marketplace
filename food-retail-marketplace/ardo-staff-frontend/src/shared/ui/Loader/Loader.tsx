import React, {FC} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import classes from "./Loader.module.scss";

export const Loader: FC = () => {
    return (
        <LoadingOutlined className={classes.loader}/>
    )
}
