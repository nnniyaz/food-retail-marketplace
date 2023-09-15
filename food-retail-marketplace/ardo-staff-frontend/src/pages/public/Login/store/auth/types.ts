export type AuthState = {
    isLoadingAuth: boolean;
    isLoadingLogout: boolean;
}

export enum AuthActionEnum {
    SET_IS_LOADING_AUTH = 'SET_IS_LOADING_AUTH',
    SET_IS_LOADING_LOGOUT = 'SET_IS_LOADING_LOGOUT',
}

export type SetIsLoadingAuthAction = {
    type: AuthActionEnum.SET_IS_LOADING_AUTH;
    payload: boolean;
}

export type SetIsLoadingLogoutAction = {
    type: AuthActionEnum.SET_IS_LOADING_LOGOUT;
    payload: boolean;
}

export type AuthAction = SetIsLoadingAuthAction | SetIsLoadingLogoutAction;
