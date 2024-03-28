import axios from "axios";
import {Langs} from "@domain/base/mlString/mlString.ts";

const validateStatus = (status: number) => {
    return (status >= 200 && status < 401);
}

const acceptLanguages = {
    [Langs.EN]: 'en',
    [Langs.RU]: 'ru',
};

export interface ApiCfg {
    baseURL: string;
    lang: Langs;
}

const $api = ({baseURL, lang}: ApiCfg) => axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'Accept-Language': acceptLanguages[lang],
    },
    timeout: 20000,
    timeoutErrorMessage: 'Timeout error',
    validateStatus: validateStatus
});

export default $api;
