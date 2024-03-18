import {UserAction, UserActionEnum, UserState} from "@app/store/reducers/user/types.ts";

const initialState: UserState = {
    isAuth: false,
    user: null,
    authError: {
        email: null,
        password: null
    },
    isLoadingLogin: false,
    isLoadingGetUser: false,
    isLoadingLogout: false,
    isLoadingRegister: false,
};

export default function userReducer(state = initialState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionEnum.SET_IS_AUTH:
            return {...state, isAuth: action.payload};
        case UserActionEnum.SET_USER:
            return {...state, user: action.payload};
        case UserActionEnum.SET_AUTH_ERROR:
            return {...state, authError: action.payload};
        case UserActionEnum.SET_IS_LOADING_LOGIN:
            return {...state, isLoadingLogin: action.payload};
        case UserActionEnum.SET_IS_LOADING_GET_USER:
            return {...state, isLoadingGetUser: action.payload};
        case UserActionEnum.SET_IS_LOADING_LOGOUT:
            return {...state, isLoadingLogout: action.payload};
        case UserActionEnum.SET_IS_LOADING_REGISTER:
            return {...state, isLoadingRegister: action.payload};
        default:
            return state;
    }
}
