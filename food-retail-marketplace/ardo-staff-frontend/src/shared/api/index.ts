 import axios from "axios";

const validateStatus = (status: number) => {
    return (status >= 200 && status < 401) || (status > 401 && status !== 403 && status !== 404 && status < 500) ;
}

const $api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000,
    timeoutErrorMessage: 'Timeout error',
    validateStatus: validateStatus
});

export default $api;

// const $apiBlob = axios.create({
//     baseURL: process.env.VITE_API_URL || '',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/octet-stream',
//     },
//     responseType: 'blob',
//     timeout: 20000,
//     timeoutErrorMessage: 'Timeout error',
//     validateStatus: validateStatus
// });
//
// export {$apiBlob};
//
// const $apiFormData = axios.create({
//     baseURL: process.env.VITE_API_URL || '',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'multipart/form-data',
//     },
//     timeout: 20000,
//     timeoutErrorMessage: 'Timeout error',
//     validateStatus: validateStatus
// });
//
// export {$apiFormData};
