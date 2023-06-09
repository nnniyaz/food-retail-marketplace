export interface AuthState {
    isAuth: boolean;
    isLoadingAuth: boolean;
}

export enum AuthActionEnum {
    SET_AUTH = 'SET_AUTH',
    SET_LOADING_AUTH = 'SET_LOADING_AUTH',
}

export interface SetAuthAction {
    type: AuthActionEnum.SET_AUTH;
    payload: boolean;
}

export interface SetLoadingAuthAction {
    type: AuthActionEnum.SET_LOADING_AUTH;
    payload: boolean;
}

export type AuthAction = SetAuthAction | SetLoadingAuthAction;
