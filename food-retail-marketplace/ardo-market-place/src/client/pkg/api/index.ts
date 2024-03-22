import axios from "axios";

const validateStatus = (status: number) => {
    return (status >= 200 && status < 401);
}

const $api = (apiUri: string) => axios.create({
    baseURL: apiUri,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    timeout: 20000,
    timeoutErrorMessage: 'Timeout error',
    validateStatus: validateStatus
});

export default $api;
