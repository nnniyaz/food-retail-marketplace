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

    // ------------------------- MANAGEMENT OF USERS --------------------------
    GET_USERS = "/management/users", // with query params: offset, limit, is_deleted
    GET_USER = "/management/users/:user_id",
    POST_USER = "/management/users",
    PUT_USER_CREDENTIALS = "/management/users/credentials/:user_id",
    PUT_USER_EMAIL = "/management/users/email/:user_id",
    PUT_USER_PREFERRED_LANG = "/management/users/preferred-lang/:user_id",
    PUT_USER_PASSWORD = "/management/users/password/:user_id",
    PUT_USER_RECOVER = "/management/users/:user_id",
    DELETE_USER = "/management/users/:user_id",

    // ------------------------ MANAGEMENT OF PRODUCTS -----------------------
    GET_PRODUCTS = "/management/products", // with query params: offset, limit, is_deleted
    GET_PRODUCT = "/management/products/:product_id",
    POST_PRODUCT = "/management/products",
    PUT_PRODUCT_CREDENTIALS = "/management/products/credentials/:product_id",
    PUT_PRODUCT_RECOVER = "/management/products/:product_id",
    DELETE_PRODUCT = "/management/products/:product_id",

    // ------------------------- MANAGEMENT OF ORDERS ------------------------
    GET_ORDERS = "/management/orders", // with query params: offset, limit, is_deleted
    GET_ORDERS_BY_USER_ID = "/management/orders/user/:user_id", // with query params: offset, limit, is_deleted
    GET_ORDER = "/management/orders/:order_id",
    POST_ORDER = "/management/orders",
    PUT_ORDER_STATUS = "/management/orders/status/:order_id",
    PUT_ORDER_RECOVER = "/management/orders/:order_id",
    DELETE_ORDER = "/management/orders/:order_id",
}
