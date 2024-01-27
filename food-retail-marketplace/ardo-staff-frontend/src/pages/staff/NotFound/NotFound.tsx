import React, {FunctionComponent} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "antd";
import {RouteNames} from "@pages/index";
import {Translate} from "@features/Translate";
import classes from "./NotFound.module.scss"

export const NotFound: FunctionComponent = () => {
    const navigate = useNavigate();
    return (
        <div className={classes.main}>
            <div className={classes.container}>
                <div className={classes.title}>{`${Translate("page_not_found")} 404`}</div>
                <Button
                    size={"large"}
                    type={"primary"}
                    onClick={() => navigate(RouteNames.USERS)}
                >
                    {Translate("to_main_menu")}
                </Button>
            </div>
        </div>
    );
};
