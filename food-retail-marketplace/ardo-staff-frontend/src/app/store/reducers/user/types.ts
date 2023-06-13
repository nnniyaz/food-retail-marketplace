import {User} from "entities/user/user";

export type UserState = {
    user: User;
    users: User[];
    usersCount: number;
    isLoadingGetUser: boolean;
    isLoadingGetUsers: boolean;
}

export enum UserActionEnum {
    SET_USER = "SET_USER",
    SET_USERS = "SET_USERS",
    SET_USERS_COUNT = "SET_USERS_COUNT",
    SET_IS_LOADING_GET_USER = "SET_IS_LOADING_GET_USER",
    SET_IS_LOADING_GET_USERS = "SET_IS_LOADING_GET_USERS",
}

export type SetUserAction = {
    type: UserActionEnum.SET_USER;
    payload: User;
}

export type SetUsersAction = {
    type: UserActionEnum.SET_USERS;
    payload: User[];
}

export type SetUsersCountAction = {
    type: UserActionEnum.SET_USERS_COUNT;
    payload: number;
}

export type SetIsLoadingGetUserAction = {
    type: UserActionEnum.SET_IS_LOADING_GET_USER;
    payload: boolean;
}

export type SetIsLoadingGetUsersAction = {
    type: UserActionEnum.SET_IS_LOADING_GET_USERS;
    payload: boolean;
}

export type UserAction =
    SetUserAction |
    SetUsersAction |
    SetUsersCountAction |
    SetIsLoadingGetUserAction |
    SetIsLoadingGetUsersAction;
