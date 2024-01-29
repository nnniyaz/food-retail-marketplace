import React, {FC} from "react";
import {Input} from "antd";

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
}

export const NumberInput: FC<NumberInputProps> = (props) => {
    return (
        <Input
            value={props.value}
            type={"number"}
            onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                props.onChange(Number(e.target.value));
            }}
        />
    );
};
