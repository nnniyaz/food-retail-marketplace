import {UsersAction, UsersActionEnum, UsersState} from "./types";

const initialState: UsersState = {
    users: [],
    userById: null,
    usersCount: 0,
    isLoadingGetUsers: false,
    isLoadingAddUser: false,
    isLoadingGetUserById: false,
    isLoadingEditUserCredentials: false,
    isLoadingEditUserEmail: false,
    isLoadingEditUserPhone: false,
    isLoadingEditUserPreferredLang: false,
    isLoadingEditUserRole: false,
    isLoadingAddUserDeliveryPoint: false,
    isLoadingEditUserDeliveryPoint: false,
    isLoadingDeleteUserDeliveryPoint: false,
    isLoadingEditUserLastDeliveryPoint: false,
    isLoadingEditUserPassword: false,
    isLoadingRecoverUser: false,
    isLoadingDeleteUser: false,
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
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_CREDENTIALS:
            return {...state, isLoadingEditUserCredentials: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_EMAIL:
            return {...state, isLoadingEditUserEmail: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_PHONE:
            return {...state, isLoadingEditUserPhone: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_PREFERRED_LANG:
            return {...state, isLoadingEditUserPreferredLang: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_ROLE:
            return {...state, isLoadingEditUserRole: action.payload}
        case UsersActionEnum.SET_IS_LOADING_ADD_USER_DELIVERY_POINT:
            return {...state, isLoadingAddUserDeliveryPoint: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_DELIVERY_POINT:
            return {...state, isLoadingEditUserDeliveryPoint: action.payload}
        case UsersActionEnum.SET_IS_LOADING_DELETE_USER_DELIVERY_POINT:
            return {...state, isLoadingDeleteUserDeliveryPoint: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_LAST_DELIVERY_POINT:
            return {...state, isLoadingEditUserLastDeliveryPoint: action.payload}
        case UsersActionEnum.SET_IS_LOADING_EDIT_USER_PASSWORD:
            return {...state, isLoadingEditUserPassword: action.payload}
        case UsersActionEnum.SET_IS_LOADING_RECOVER_USER:
            return {...state, isLoadingRecoverUser: action.payload}
        case UsersActionEnum.SET_IS_LOADING_DELETE_USER:
            return {...state, isLoadingDeleteUser: action.payload}
        default:
            return state;
    }
}
