import {FC} from "react";
import classes from "./Text.module.scss";

enum TextType {
    TEXT_MEDIUM = "text-medium",
    LABEL_MEDIUM = "label-medium"
}

interface TextProps {
    text: string
    type?: TextType | string
}

export const Text: FC<TextProps> = ({text, type}) => {
    const style = (type?: string) => {
        switch (type as TextType) {
            case TextType.LABEL_MEDIUM:
                return classes.label__medium
            case TextType.TEXT_MEDIUM:
            default:
                return classes.text__medium
        }
    }
    return <span className={style(type)}>{text}</span>
}
