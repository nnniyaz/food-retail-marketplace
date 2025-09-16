import React, {FC} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {Text} from "@shared/ui/Text";
import {Divider} from "@shared/ui/Divider";
import classes from "./Block.module.scss";

interface BlockProps {
    loading?: boolean;
    label?: string;
    children: React.ReactNode;
}

export const Block: FC<BlockProps> = ({children, loading, label}) => {
    return (
        <div className={classes.block}>
            {loading
                ?
                <LoadingOutlined/>
                :
                <div className={classes.container}>
                    {label && (
                        <React.Fragment>
                            <Text text={label} type={"label-medium"}/>
                            <Divider/>
                        </React.Fragment>
                    )}
                    {children}
                </div>
            }
        </div>
    )
}
