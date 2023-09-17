export enum ApiRoutes {
    // --------------------------------- Auth ---------------------------------
    POST_LOGIN = "/auth/login",
    POST_LOGOUT = "/auth/logout",
    POST_REGISTER = "/auth/register",

    // ----------------------------- CURRENT USER -----------------------------
    GET_ME = "/me",
    PUT_ME = "/me",
    PUT_ME_PASSWORD = "/me/password",

    // ------------------------- MANAGEMENT OF USERS --------------------------
    GET_USERS = "/management/users", // with query params: offset, limit, is_deleted
    GET_USER = "/management/users/:user_id",
    POST_USER = "/management/users",
    PUT_USER = "/management/users/:user_id",
    PUT_USER_PASSWORD = "/management/users/:user_id/password",
    PUT_USER_RECOVER = "/management/users/:user_id/recover",
    DELETE_USER = "/management/users/:user_id",

    // ---------------------- MANAGEMENT OF ORGANIZATIONS ----------------------
    GET_ORGANIZATIONS = "/management/organizations", // with query params: offset, limit, is_deleted
    GET_ORGANIZATION = "/management/organizations/:org_id",
    POST_ORGANIZATION = "/management/organizations",
    PUT_ORGANIZATION = "/management/organizations/:org_id",
    PUT_ORGANIZATION_LOGO = "/management/organizations/:org_id/logo",
    DELETE_ORGANIZATION = "/management/organizations/:org_id",

    // ------------------- MANAGEMENT OF ORGANIZATION'S USERS -------------------
    GET_ORGANIZATION_USERS = "/management/organizations/:org_id/users", // with query params: offset, limit, is_deleted
    POST_ORGANIZATION_USER = "/management/organizations/:org_id/users",

    // ---------------------------------- UPLOAD --------------------------------
    POST_UPLOAD = "/upload",
}
