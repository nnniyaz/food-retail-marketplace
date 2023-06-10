export type AuthState = {
    isAuth: boolean;
    isLoadingAuth: boolean;
}

export enum AuthActionEnum {
    SET_AUTH = 'SET_AUTH',
    SET_IS_LOADING_AUTH = 'SET_IS_LOADING_AUTH',
}

export type SetAuthAction = {
    type: AuthActionEnum.SET_AUTH;
    payload: boolean;
}

export type SetIsLoadingAuthAction = {
    type: AuthActionEnum.SET_IS_LOADING_AUTH;
    payload: boolean;
}

export type AuthAction = SetAuthAction | SetIsLoadingAuthAction;
