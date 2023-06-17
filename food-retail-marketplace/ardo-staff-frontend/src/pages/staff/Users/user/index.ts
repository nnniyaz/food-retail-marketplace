import {UsersAction, UsersActionEnum, UsersState} from "./types";

const initialState: UsersState = {
    users: [],
    usersCount: 0,
    isLoadingGetUsers: false,
}

export default function userReducer(state = initialState, action: UsersAction): UsersState {
    switch (action.type) {
        case UsersActionEnum.SET_USERS:
            return {...state, users: action.payload}
        case UsersActionEnum.SET_USERS_COUNT:
            return {...state, usersCount: action.payload}
        case UsersActionEnum.SET_IS_LOADING_GET_USERS:
            return {...state, isLoadingGetUsers: action.payload}
        default:
            return state;
    }
}
