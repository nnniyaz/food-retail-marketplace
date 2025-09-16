import {AuthAction, AuthActionEnum, AuthState} from "./types";

const initialState: AuthState = {
    isLoadingAuth: false,
    isLoadingLogout: false,
}

export default function authReducer(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthActionEnum.SET_IS_LOADING_AUTH:
            return {...state, isLoadingAuth: action.payload}
        case AuthActionEnum.SET_IS_LOADING_LOGOUT:
            return {...state, isLoadingLogout: action.payload}
        default:
            return state;
    }
}
