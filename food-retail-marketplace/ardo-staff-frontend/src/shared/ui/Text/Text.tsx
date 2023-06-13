import {FC} from "react";
import classes from "./Text.module.scss";

enum TextType {
    TEXT_MEDIUM = "text-medium",
    TEXT_SMALL = "text-small",
    LABEL_MEDIUM = "label-medium",
    LABEL_LARGE = "label-large",
}

interface TextProps {
    text: string;
    type?: TextType | string;
    light?: boolean;
}

export const Text: FC<TextProps> = ({text, type, light}) => {
    const style = (type?: string) => {
        switch (type as TextType) {
            case TextType.LABEL_MEDIUM:
                return classes.label__medium;
            case TextType.LABEL_LARGE:
                return classes.label__large;
            case TextType.TEXT_SMALL:
                return classes.text__small;
            case TextType.TEXT_MEDIUM:
            default:
                return classes.text__medium;
        }
    }
    return <span className={style(type)} style={{color: light ? "#FFFFFF" : ""}}>{text}</span>
}
