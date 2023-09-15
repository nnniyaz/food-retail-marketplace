import {User} from "entities/user/user";

export type UsersState = {
    users: User[];
    userById: User | null;
    usersCount: number;
    isLoadingGetUsers: boolean;
    isLoadingAddUser: boolean;
    isLoadingGetUserById: boolean;
    isLoadingEditUser: boolean;
    isLoadingDeleteUser: boolean;
    isLoadingRecoverUser: boolean;
}

export enum UsersActionEnum {
    SET_USERS = "SET_USERS",
    SET_USER_BY_ID = "SET_USER_BY_ID",
    SET_USERS_COUNT = "SET_USERS_COUNT",
    SET_IS_LOADING_GET_USERS = "SET_IS_LOADING_GET_USERS",
    SET_IS_LOADING_GET_USER_BY_ID = "SET_IS_LOADING_GET_USER_BY_ID",
    SET_IS_LOADING_ADD_USER = "SET_IS_LOADING_ADD_USER",
    SET_IS_LOADING_EDIT_USER = "SET_IS_LOADING_EDIT_USER",
    SET_IS_LOADING_DELETE_USER = "SET_IS_LOADING_DELETE_USER",
    SET_IS_LOADING_RECOVER_USER = "SET_IS_LOADING_RECOVER_USER",
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

export interface SetIsLoadingEditUserAction {
    type: UsersActionEnum.SET_IS_LOADING_EDIT_USER;
    payload: boolean;
}

export interface SetIsLoadingDeleteUserAction {
    type: UsersActionEnum.SET_IS_LOADING_DELETE_USER;
    payload: boolean;
}

export interface SetIsLoadingRecoverUserAction {
    type: UsersActionEnum.SET_IS_LOADING_RECOVER_USER;
    payload: boolean;
}

export type UsersAction =
    SetUsersAction |
    SetUserByIdAction |
    SetUsersCountAction |
    SetIsLoadingGetUsersAction |
    SetIsLoadingAddUserAction |
    SetIsLoadingGetUserByIdAction |
    SetIsLoadingEditUserAction |
    SetIsLoadingDeleteUserAction |
    SetIsLoadingRecoverUserAction;
