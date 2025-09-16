import {User} from "@entities/user/user";

export type UsersState = {
    users: User[];
    userById: User | null;
    usersCount: number;
    isLoadingGetUsers: boolean;
    isLoadingAddUser: boolean;
    isLoadingGetUserById: boolean;
    isLoadingEditUserCredentials: boolean;
    isLoadingEditUserEmail: boolean;
    isLoadingEditUserPhone: boolean;
    isLoadingEditUserPreferredLang: boolean;
    isLoadingEditUserRole: boolean;
    isLoadingAddUserDeliveryPoint: boolean;
    isLoadingEditUserDeliveryPoint: boolean;
    isLoadingDeleteUserDeliveryPoint: boolean;
    isLoadingEditUserLastDeliveryPoint: boolean;
    isLoadingEditUserPassword: boolean;
    isLoadingRecoverUser: boolean;
    isLoadingDeleteUser: boolean;
}

export enum UsersActionEnum {
    SET_USERS = "SET_USERS",
    SET_USER_BY_ID = "SET_USER_BY_ID",
    SET_USERS_COUNT = "SET_USERS_COUNT",
    SET_IS_LOADING_GET_USERS = "SET_IS_LOADING_GET_USERS",
    SET_IS_LOADING_GET_USER_BY_ID = "SET_IS_LOADING_GET_USER_BY_ID",
    SET_IS_LOADING_ADD_USER = "SET_IS_LOADING_ADD_USER",
    SET_IS_LOADING_EDIT_USER_CREDENTIALS = "SET_IS_LOADING_EDIT_USER_CREDENTIALS",
    SET_IS_LOADING_EDIT_USER_EMAIL = "SET_IS_LOADING_EDIT_USER_EMAIL",
    SET_IS_LOADING_EDIT_USER_PHONE = "SET_IS_LOADING_EDIT_USER_PHONE",
    SET_IS_LOADING_EDIT_USER_PREFERRED_LANG = "SET_IS_LOADING_EDIT_USER_PREFERRED_LANG",
    SET_IS_LOADING_EDIT_USER_ROLE = "SET_IS_LOADING_EDIT_USER_ROLE",
    SET_IS_LOADING_ADD_USER_DELIVERY_POINT = "SET_IS_LOADING_ADD_USER_DELIVERY_POINT",
    SET_IS_LOADING_EDIT_USER_DELIVERY_POINT = "SET_IS_LOADING_EDIT_USER_DELIVERY_POINT",
    SET_IS_LOADING_DELETE_USER_DELIVERY_POINT = "SET_IS_LOADING_DELETE_USER_DELIVERY_POINT",
    SET_IS_LOADING_EDIT_USER_LAST_DELIVERY_POINT = "SET_IS_LOADING_EDIT_USER_LAST_DELIVERY_POINT",
    SET_IS_LOADING_EDIT_USER_PASSWORD = "SET_IS_LOADING_EDIT_USER_PASSWORD",
    SET_IS_LOADING_RECOVER_USER = "SET_IS_LOADING_RECOVER_USER",
    SET_IS_LOADING_DELETE_USER = "SET_IS_LOADING_DELETE_USER",
}

export interface SetUsersAction {
    type: UsersActionEnum.SET_USERS;
    payload: User[];
}

export interface SetUserByIdAction {
    type: UsersActionEnum.SET_USER_BY_ID;
    payload: User | null;
}

export interface SetUsersCountAction {
    type: UsersActionEnum.SET_USERS_COUNT;
    payload: number;
}

export interface SetIsLoadingGetUsersAction {
    type: UsersActionEnum.SET_IS_LOADING_GET_USERS;
    payload: boolean;
}

export interface SetIsLoadingAddUserAction {
    type: UsersActionEnum.SET_IS_LOADING_ADD_USER;
    payload: boolean;
}

export interface SetIsLoadingGetUserByIdAction {
    type: UsersActionEnum.SET_IS_LOADING_GET_USER_BY_ID;
    payload: boolean;
}

export interface SetIsLoadingEditUserCredentialsAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_CREDENTIALS;
    payload: boolean;
}

export interface SetIsLoadingEditUserEmailAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_EMAIL;
    payload: boolean;
}

export interface SetIsLoadingEditUserPhoneAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_PHONE;
    payload: boolean;
}

export interface SetIsLoadingEditUserPreferredLangAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_PREFERRED_LANG;
    payload: boolean;
}

export interface SetIsLoadingEditUserRoleAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_ROLE;
    payload: boolean;
}

export interface SetIsLoadingAddUserDeliveryPointAction {
    type: UsersActionEnum.SET_IS_LOADING_ADD_USER_DELIVERY_POINT;
    payload: boolean;
}

export interface SetIsLoadingEditUserDeliveryPointAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_DELIVERY_POINT;
    payload: boolean;
}

export interface SetIsLoadingDeleteUserDeliveryPointAction {
    type: UsersActionEnum.SET_IS_LOADING_DELETE_USER_DELIVERY_POINT;
    payload: boolean;
}

export interface SetIsLoadingEditUserLastDeliveryPointAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_LAST_DELIVERY_POINT;
    payload: boolean;
}

export interface SetIsLoadingEditUserPasswordAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_PASSWORD;
    payload: boolean;
}

export interface SetIsLoadingRecoverUserAction {
    type: UsersActionEnum.SET_IS_LOADING_RECOVER_USER;
    payload: boolean;
}

export interface SetIsLoadingDeleteUserAction {
    type: UsersActionEnum.SET_IS_LOADING_DELETE_USER;
    payload: boolean;
}

export type UsersAction =
    SetUsersAction |
    SetUserByIdAction |
    SetUsersCountAction |
    SetIsLoadingGetUsersAction |
    SetIsLoadingAddUserAction |
    SetIsLoadingGetUserByIdAction |
    SetIsLoadingEditUserCredentialsAction |
    SetIsLoadingEditUserEmailAction |
    SetIsLoadingEditUserPhoneAction |
    SetIsLoadingEditUserPreferredLangAction |
    SetIsLoadingEditUserRoleAction |
    SetIsLoadingAddUserDeliveryPointAction |
    SetIsLoadingEditUserDeliveryPointAction |
    SetIsLoadingDeleteUserDeliveryPointAction |
    SetIsLoadingEditUserLastDeliveryPointAction |
    SetIsLoadingEditUserPasswordAction |
    SetIsLoadingRecoverUserAction |
    SetIsLoadingDeleteUserAction;
