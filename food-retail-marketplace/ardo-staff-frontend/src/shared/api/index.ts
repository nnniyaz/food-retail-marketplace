import axios from "axios";

const $api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000,
    timeoutErrorMessage: 'Timeout error',
});

$api.interceptors.request.use((config) => {
    // @ts-ignore
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
})

export default $api;

const $apiBlob = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob',
    timeout: 20000,
    timeoutErrorMessage: 'Timeout error',
});

export {$apiBlob};

const $apiFormData = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 20000,
    timeoutErrorMessage: 'Timeout error',
});

export {$apiFormData};
