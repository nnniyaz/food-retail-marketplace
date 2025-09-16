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

    POST_DELIVERY_POINT = "/me/delivery-point",
    PUT_DELIVERY_POINT = "/me/delivery-point",
    DELETE_DELIVERY_POINT = "/me/delivery-point/:delivery_point_id",
    PUT_LAST_DELIVERY_POINT = "/me/last-delivery-point",

    // -------------------------------- CLIENT --------------------------------
    GET_ORDERS = "/client/orders",
    POST_MAKE_ORDER = "/client/make-order",
}
