export function responseSuccess(data: any) {
    return {
        success: true,
        data: data
    }
}

export function responseError(messages: string[]) {
    return {
        success: false,
        messages: messages
    }
}
