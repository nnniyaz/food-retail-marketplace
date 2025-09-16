import {Langs} from "@entities/base/MlString";
import moment from "moment";

export const relativeFormat = (input: Timestamp, currentLang: Langs): string => {
    if (!input) return "";
    const date = new Date(input);
    return moment(date.toISOString()).locale(currentLang).fromNow();
}
