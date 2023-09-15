import {UsersAction, UsersActionEnum, UsersState} from "./types";

const initialState: UsersState = {
    users: [],
    userById: null,
    usersCount: 0,
    isLoadingGetUsers: false,
    isLoadingAddUser: false,
    isLoadingGetUserById: false,
    isLoadingEditUser: false,
    isLoadingDeleteUser: false,
    isLoadingRecoverUser: false,
}

export default function userReducer(state = initialState, action: UsersAction): UsersState {
    switch (action.type) {
        case UsersActionEnum.SET_USERS:
            return {...state, users: action.payload}
        case UsersActionEnum.SET_USER_BY_ID:
            return {...state, userById: action.payload}
        case UsersActionEnum.SET_USERS_COUNT:
            return {...state, usersCount: action.payload}
        case UsersActionEnum.SET_IS_LOADING_GET_USERS:
            return {...state, isLoadingGetUsers: action.payload}
        case UsersActionEnum.SET_IS_LOADING_ADD_USER:
            return {...state, isLoadingAddUser: action.payload}
        case UsersActionEnum.SET_IS_LOADING_GET_USER_BY_ID:
            return {...state, isLoadingGetUserById: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER:
            return {...state, isLoadingEditUser: action.payload}
        case UsersActionEnum.SET_IS_LOADING_DELETE_USER:
            return {...state, isLoadingDeleteUser: action.payload}
        case UsersActionEnum.SET_IS_LOADING_RECOVER_USER:
            return {...state, isLoadingRecoverUser: action.payload}
        default:
            return state;
    }
}
