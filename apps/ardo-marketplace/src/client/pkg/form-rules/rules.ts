import {FormRule} from "antd";

interface IRules {
    required: (message: string) => FormRule,
    email: (message: string) => FormRule,
    phone: (message: string) => FormRule,
}

export const rules: IRules = {
    required: (message: string) => ({required: true, message: message}),
    email: (message: string) => ({type: 'email', message: message}),
    phone: (message: string) => ({pattern: /^(\+852)?[569]\d{7}$/, message: message}),
}
