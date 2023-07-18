import {User} from "entities/user/user";

export type UserState = {
    user: User;
    isAuth: boolean;
    isLoadingGetUser: boolean;
}

export enum UserActionEnum {
    SET_USER = "SET_USER",
    SET_IS_AUTH = "SET_IS_AUTH",
    SET_IS_LOADING_GET_USER = "SET_IS_LOADING_GET_USER",
}

export type SetUserAction = {
    type: UserActionEnum.SET_USER;
    payload: User;
}

export type SetIsAuthAction = {
    type: UserActionEnum.SET_IS_AUTH;
    payload: boolean;
}

export type SetIsLoadingGetUserAction = {
    type: UserActionEnum.SET_IS_LOADING_GET_USER;
    payload: boolean;
}

export type UserAction =
    SetUserAction |
    SetIsAuthAction |
    SetIsLoadingGetUserAction;
