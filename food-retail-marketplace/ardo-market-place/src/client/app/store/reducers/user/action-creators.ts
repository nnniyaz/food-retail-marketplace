import {
    UserActionEnum,
    SetIsAuthAction,
    SetUserAction,
    SetAuthErrorAction,
    SetIsLoadingLoginAction,
    SetIsLoadingGetUserAction,
    SetIsLoadingLogoutAction,
    SetIsLoadingRegisterAction,
} from "@app/store/reducers/user/types.ts";
import {AppDispatch, RootState} from "@app/store";
import {User} from "@domain/user/user.ts";
import {Notify} from "@pkg/notification/notification.tsx";
import {UserService} from "@services/userServices.ts";
import AuthService, {RegisterRequest} from "@services/authService.ts";
import {CartActionCreator} from "@app/store/reducers/cart/action-creators.ts";
import {txts} from "../../../../../server/pkg/core/txts.ts";

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

    login: (email: string, password: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang, cfg} = getState().systemState;
        try {
            dispatch(UserActionCreator.setIsLoadingLogin(true));
            const res = await AuthService.login(cfg.apiUri, {email, password});
            if (res.data.success) {
                await UserActionCreator.fetchUser(false)(dispatch, getState);
            } else {
                if (res.data.messages) {
                    res.data.messages.forEach((message: string) => {
                        if (message === "User with this email does not exist") {
                            dispatch(UserActionCreator.setAuthError({
                                email: txts["user_with_this_email_does_not_exist"][currentLang],
                                password: null
                            }));
                        }
                        if (message === "Invalid password") {
                            dispatch(UserActionCreator.setAuthError({
                                email: null,
                                password: txts["invalid_password"][currentLang]
                            }));
                        }
                    });
                }
            }
        } catch (e: any) {
            Notify.Error({message: txts["failed_authorization"][currentLang]});
        } finally {
            dispatch(UserActionCreator.setIsLoadingLogin(false));
        }
    },

    fetchUser: (disableNotification: boolean) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang, cfg} = getState().systemState;
        try {
            dispatch(UserActionCreator.setIsLoadingGetUser(true));
            const res = await UserService.getCurrentUser(cfg.apiUri);
            if (res.data.success) {
                dispatch(UserActionCreator.setUser(res.data.data));
                dispatch(UserActionCreator.setIsAuth(true));
                dispatch(CartActionCreator.setCustomerContacts({
                    name: res.data.data.firstName + " " + res.data.data.lastName,
                    phone: "",
                    email: res.data.data.email,
                }))
                dispatch(CartActionCreator.setDeliveryInfo({
                    address: "",
                    floor: "",
                    apartment: "",
                    deliveryComment: "",
                }))
                if (!disableNotification) {
                    Notify.Success({message: txts["successful_authentication"][currentLang]});
                }
            } else {
                if (!disableNotification) {
                    Notify.Error({message: txts["failed_authorization"][currentLang]});
                }
            }
        } catch (e: any) {
            if (!disableNotification) {
                Notify.Error({message: txts["failed_authorization"][currentLang]});
            }
        } finally {
            dispatch(UserActionCreator.setIsLoadingGetUser(false));
        }
    },

    Logout: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang, cfg} = getState().systemState;
        try {
            dispatch(UserActionCreator.setIsLoadingLogout(true));
            const res = await AuthService.logout(cfg.apiUri);
            if (res.data.success) {
                dispatch(UserActionCreator.setUser(null));
                dispatch(UserActionCreator.setIsAuth(false));
                Notify.Success({message: txts["successful_logout"][currentLang]});
            } else {
                Notify.Error({message: txts["failed_to_logout"][currentLang]});
            }
        } catch (e: any) {
            Notify.Error({message: txts["failed_to_logout"][currentLang]});
        } finally {
            dispatch(UserActionCreator.setIsLoadingLogout(false));
        }
    },

    register: (request: RegisterRequest) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang, cfg} = getState().systemState;
        try {
            dispatch(UserActionCreator.setIsLoadingRegister(true));
            const res = await AuthService.register(cfg.apiUri, request);
            if (res.data.success) {
                Notify.Success({message: txts["confirmation_mail_was_sent_to_your_email"][currentLang]});
            } else {
                Notify.Error({message: txts["failed_to_register"][currentLang]});
            }
        } catch (e: any) {
            Notify.Error({message: txts["failed_to_register"][currentLang]});
        } finally {
            dispatch(UserActionCreator.setIsLoadingRegister(false));
        }
    },
}
