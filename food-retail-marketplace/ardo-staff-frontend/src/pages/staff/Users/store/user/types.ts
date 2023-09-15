import {User} from "entities/user/user";

export type UsersState = {
    users: User[];
    usersCount: number;
    isLoadingGetUsers: boolean;
    isLoadingAddUsers: boolean;
}

export enum UsersActionEnum {
    SET_USERS = "SET_USERS",
    SET_USERS_COUNT = "SET_USERS_COUNT",
    SET_IS_LOADING_GET_USERS = "SET_IS_LOADING_GET_USERS",
    SET_IS_LOADING_ADD_USERS = "SET_IS_LOADING_ADD_USERS",
}

export type SetUsersAction = {
    type: UsersActionEnum.SET_USERS;
    payload: User[];
}

export type SetUsersCountAction = {
    type: UsersActionEnum.SET_USERS_COUNT;
    payload: number;
}

export type SetIsLoadingGetUsersAction = {
    type: UsersActionEnum.SET_IS_LOADING_GET_USERS;
    payload: boolean;
}

export type SetIsLoadingAddUsersAction = {
    type: UsersActionEnum.SET_IS_LOADING_ADD_USERS;
    payload: boolean;
}

export type UsersAction =
    SetUsersAction |
    SetUsersCountAction |
    SetIsLoadingGetUsersAction |
    SetIsLoadingAddUsersAction;
