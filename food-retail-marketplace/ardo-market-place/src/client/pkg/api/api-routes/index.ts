export enum ApiRoutes {
    // --------------------------------- Auth ---------------------------------
    POST_LOGIN = "/auth/login",
    POST_LOGOUT = "/auth/logout",
    POST_REGISTER = "/auth/register",

    // ----------------------------- CURRENT USER -----------------------------
    GET_ME = "/me",
    PUT_ME_CREDENTIALS = "/me/credentials",
    PUT_ME_EMAIL = "/me/email",
    PUT_ME_PREFERRED_LANG = "/me/preferred-lang",
    PUT_ME_PASSWORD = "/me/password",

    // -------------------------------- CLIENT --------------------------------
    POST_MAKE_ORDER = "/client/make-order",
}
