export const validatePhone = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^\+852\d{8}$/
        );
};
