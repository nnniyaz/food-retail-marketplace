export type AuthState = {
    isLoadingAuth: boolean;
}

export enum AuthActionEnum {
    SET_IS_LOADING_AUTH = 'SET_IS_LOADING_AUTH',
}

export type SetIsLoadingAuthAction = {
    type: AuthActionEnum.SET_IS_LOADING_AUTH;
    payload: boolean;
}

export type AuthAction = SetIsLoadingAuthAction;
