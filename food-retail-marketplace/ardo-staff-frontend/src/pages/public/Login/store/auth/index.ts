import {AuthAction, AuthActionEnum, AuthState} from "./types";

const initialState: AuthState = {
    isAuth: false,
    isLoadingAuth: false,
}

export default function authReducer(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthActionEnum.SET_AUTH:
            return {...state, isAuth: action.payload}
        case AuthActionEnum.SET_LOADING_AUTH:
            return {...state, isLoadingAuth: action.payload}
        default:
            return state;
    }
}
