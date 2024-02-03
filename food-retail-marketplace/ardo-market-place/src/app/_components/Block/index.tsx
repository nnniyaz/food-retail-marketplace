import React from 'react';
import classes from "./Block.module.scss";

interface IBlockProps {
    children?: React.ReactNode;
    width?: string;
}

const Block = (props: IBlockProps) => {
    return (
        <div className={classes["block"]} style={{width: props.width}}>
            {props.children}
        </div>
    );
};

export default Block;
