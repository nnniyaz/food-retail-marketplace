import {FormRule} from "antd";

interface IRules {
    required: (message: string) => FormRule,
    email: (message: string) => FormRule,
    minmaxLen: (message: string, min: number, max: number) => FormRule,
}

export const rules: IRules = {
    required: (message: string) => ({required: true, message: message}),
    email: (message: string) => ({type: 'email', message: message}),
    minmaxLen: (message: string, min: number, max: number) => ({
        validator(_: any, value: string) {
            if (value === undefined || value === null) {
                return Promise.resolve();
            }
            if (value.length < min || value.length > max) {
                return Promise.reject(message);
            }
            return Promise.resolve();
        }
    }),
}
