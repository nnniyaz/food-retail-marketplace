import {User} from "entities/user/user";
import {UserAction, UserActionEnum, UserState} from "./types";

const initialState: UserState = {
    user: {} as User,
    isAuth: false,
    isLoadingGetUser: false,
}

export default function userReducer(state = initialState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionEnum.SET_USER:
            return {...state, user: action.payload}
        case UserActionEnum.SET_IS_AUTH:
            return {...state, isAuth: action.payload}
        case UserActionEnum.SET_IS_LOADING_GET_USER:
            return {...state, isLoadingGetUser: action.payload}
        default:
            return state;
    }
}
