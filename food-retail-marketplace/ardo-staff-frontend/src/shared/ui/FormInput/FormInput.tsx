import React, {FC} from "react";
import {Form, FormRule, Input} from "antd";
import {Text} from "../Text";
import classes from "./FormInput.module.scss";

interface FormInputProps {
    id?: string;
    label?: string;
    rules?: FormRule[];
    value: string;
    setValue:  React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
}

export const FormInput: FC<FormInputProps> = ({id, label, rules, value, setValue, placeholder}) => {
    return (
        <div className={classes.form__input}>
            {label && (
                <label className={classes.label} htmlFor={id}>
                    <Text text={label} type={"label-medium"}/>
                </label>
            )}
            <Form.Item id={id} name={id} className={classes.input} rules={rules || []}>
                <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}/>
            </Form.Item>
        </div>
    )
}
