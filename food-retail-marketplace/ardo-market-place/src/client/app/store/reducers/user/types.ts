import {User} from "@domain/user/user.ts";

export interface UserState {
    isAuth: boolean;
    user: User | null;
    authError: {
        email: string | null;
        password: string | null;
    };
    isLoadingLogin: boolean;
    isLoadingGetUser: boolean;
    isLoadingLogout: boolean;
    isLoadingRegister: boolean;
}

export enum UserActionEnum {
    SET_IS_AUTH = "SET_IS_AUTH",
    SET_USER = "SET_USER",
    SET_AUTH_ERROR = "SET_AUTH_ERROR",
    SET_IS_LOADING_LOGIN = "SET_IS_LOADING_LOGIN",
    SET_IS_LOADING_GET_USER = "SET_IS_LOADING_GET_USER",
    SET_IS_LOADING_LOGOUT = "SET_IS_LOADING_LOGOUT",
    SET_IS_LOADING_REGISTER = "SET_IS_LOADING_REGISTER",
}

export interface SetIsLoadingLoginAction {
    type: UserActionEnum.SET_IS_LOADING_LOGIN;
    payload: boolean;
}

export interface SetIsAuthAction {
    type: UserActionEnum.SET_IS_AUTH;
    payload: boolean;
}

export interface SetAuthErrorAction {
    type: UserActionEnum.SET_AUTH_ERROR;
    payload: {
        email: string | null;
        password: string | null;
    };
}

export interface SetUserAction {
    type: UserActionEnum.SET_USER;
    payload: User | null;
}

export interface SetIsLoadingGetUserAction {
    type: UserActionEnum.SET_IS_LOADING_GET_USER;
    payload: boolean;
}

export interface SetIsLoadingLogoutAction {
    type: UserActionEnum.SET_IS_LOADING_LOGOUT;
    payload: boolean;
}

export interface SetIsLoadingRegisterAction {
    type: UserActionEnum.SET_IS_LOADING_REGISTER;
    payload: boolean;
}

export type UserAction =
    SetIsAuthAction |
    SetUserAction |
    SetAuthErrorAction |
    SetIsLoadingLoginAction |
    SetIsLoadingGetUserAction |
    SetIsLoadingLogoutAction |
    SetIsLoadingRegisterAction;
