import axios from "axios";

const validateStatus = (status: number) => {
    return (status >= 200 && status < 401) || (status > 401 && status !== 403 && status !== 404 && status < 500);
}

const $api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    timeout: 120000,
    timeoutErrorMessage: 'Timeout error',
    validateStatus: validateStatus
});

export default $api;
