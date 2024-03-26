import axios from "axios";
import {Langs} from "@domain/base/mlString/mlString.ts";

const validateStatus = (status: number) => {
    return (status >= 200 && status < 401);
}

const acceptLanguages = {
    [Langs.EN]: 'en',
    [Langs.RU]: 'ru',
};

const $api = (apiUri: string, lang: Langs) => axios.create({
    baseURL: apiUri,
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
