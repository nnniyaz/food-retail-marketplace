import {
    SetIsAuthAction,
    SetUserAction,
    SetAuthErrorAction,
    SetIsLoadingLoginAction,
    SetIsLoadingGetUserAction,
    SetIsLoadingLogoutAction,
    SetIsLoadingRegisterAction,
    UserActionEnum,
} from "@app/store/reducers/user/types.ts";
import {AppDispatch} from "@app/store";
import {User} from "@domain/user/user.ts";
import {Notify} from "@pkg/notification/notification.tsx";
import {UserService} from "@services/userServices.ts";
import AuthService, {RegisterRequest} from "@services/authService.ts";
import {translate} from "@pkg/translate/translate.ts";

export const UserActionCreator = {
    setIsAuth: (payload: boolean): SetIsAuthAction => ({
        type: UserActionEnum.SET_IS_AUTH,
        payload
    }),
    setUser: (payload: User | null): SetUserAction => ({
        type: UserActionEnum.SET_USER,
        payload
    }),
    setAuthError: (payload: { email: string, password: string }): SetAuthErrorAction => ({
        type: UserActionEnum.SET_AUTH_ERROR,
        payload
    }),
    setIsLoadingLogin: (payload: boolean): SetIsLoadingLoginAction => ({
        type: UserActionEnum.SET_IS_LOADING_LOGIN,
        payload
    }),
    setIsLoadingGetUser: (payload: boolean): SetIsLoadingGetUserAction => ({
        type: UserActionEnum.SET_IS_LOADING_GET_USER,
        payload
    }),
    setIsLoadingLogout: (payload: boolean): SetIsLoadingLogoutAction => ({
        type: UserActionEnum.SET_IS_LOADING_LOGOUT,
        payload
    }),
    setIsLoadingRegister: (payload: boolean): SetIsLoadingRegisterAction => ({
        type: UserActionEnum.SET_IS_LOADING_REGISTER,
        payload
    }),

    login: (email: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(UserActionCreator.setIsLoadingLogin(true));
            const res = await AuthService.login({email, password});
            if (res.data.success) {
                await UserActionCreator.fetchUser(false)(dispatch);
            } else {
                if (res.data.messages) {
                    res.data.messages.forEach((message: string) => {
                        if (message === "User with this email does not exist") {
                            dispatch(UserActionCreator.setAuthError({
                                email: translate("user_with_this_email_does_not_exist"),
                                password: null
                            }));
                        }
                        if (message === "Invalid password") {
                            dispatch(UserActionCreator.setAuthError({
                                email: null,
                                password: translate("invalid_password")
                            }));
                        }
                    });
                }
            }
        } catch (e: any) {
            Notify.Error({message: translate("failed_authorization")});
        } finally {
            dispatch(UserActionCreator.setIsLoadingLogin(false));
        }
    },

    fetchUser: (disableNotification: boolean) => async (dispatch: AppDispatch) => {
        try {
            dispatch(UserActionCreator.setIsLoadingGetUser(true));
            const res = await UserService.getCurrentUser();
            if (res.data.success) {
                dispatch(UserActionCreator.setUser(res.data.data));
                dispatch(UserActionCreator.setIsAuth(true));
                if (!disableNotification) {
                    Notify.Success({message: translate("successful_authentication")});
                }
            } else {
                if (!disableNotification) {
                    Notify.Error({message: translate("failed_authorization")});
                }
            }
        } catch (e: any) {
            if (!disableNotification) {
                Notify.Error({message: translate("failed_authorization")});
            }
        } finally {
            dispatch(UserActionCreator.setIsLoadingGetUser(false));
        }
    },

    Logout: () => async (dispatch: AppDispatch) => {
        try {
            dispatch(UserActionCreator.setIsLoadingLogout(true));
            const res = await AuthService.logout();
            if (res.data.success) {
                dispatch(UserActionCreator.setUser(null));
                dispatch(UserActionCreator.setIsAuth(false));
                Notify.Success({message: translate("successful_logout")});
            } else {
                Notify.Error({message: translate("failed_to_logout")});
            }
        } catch (e: any) {
            Notify.Error({message: translate("failed_to_logout")});
        } finally {
            dispatch(UserActionCreator.setIsLoadingLogout(false));
        }
    },

    register: (request: RegisterRequest) => async (dispatch: AppDispatch) => {
        try {
            dispatch(UserActionCreator.setIsLoadingRegister(true));
            const res = await AuthService.register(request);
            if (res.data.success) {
                Notify.Success({message: translate("confirmation_mail_was_sent_to_your_email")});
            } else {
                Notify.Error({message: translate("failed_to_register")});
            }
        } catch (e: any) {
            Notify.Error({message: translate("failed_to_register")});
        } finally {
            dispatch(UserActionCreator.setIsLoadingRegister(false));
        }
    },
}
