import {AppDispatch, RootState} from "@app/store";
import {LangActionCreators} from "@app/store/reducers/lang/action-creators";
import UserService from "@pages/public/Login/api/userService";
import {User, UserType} from "@entities/user/user";
import {Langs} from "@entities/base/MlString";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {SetIsAuthAction, SetIsLoadingGetUserAction, SetUserAction, UserActionEnum} from "./types";

export const UserActionCreators = {
    setUser: (payload: User): SetUserAction => ({
        type: UserActionEnum.SET_USER,
        payload
    }),
    setAuth: (payload: boolean): SetIsAuthAction => ({
        type: UserActionEnum.SET_IS_AUTH,
        payload
    }),
    setIsLoadingGetUser: (payload: boolean): SetIsLoadingGetUserAction => ({
        type: UserActionEnum.SET_IS_LOADING_GET_USER,
        payload
    }),

    getCurrentUser: (navigateCallback: NavigateCallback, hideNotify?: boolean) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UserActionCreators.setIsLoadingGetUser(true));
            const res = await UserService.getCurrentUser();
            if (res.data.success) {
                if (res.data.data.userType === UserType.CLIENT) {
                    const mainClientUri = import.meta.env.VITE_MAIN_CLIENT_URI;
                    if (mainClientUri) {
                        window.location.href = mainClientUri + "/profile";
                    }
                    return;
                }
                dispatch(UserActionCreators.setUser(res.data.data));
                dispatch(LangActionCreators.setLang(res.data.data.preferredLang || Langs.EN));
                dispatch(UserActionCreators.setAuth(true));
            } else {
                dispatch(UserActionCreators.setAuth(false));
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    hideNotify: hideNotify,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigateCallback,
                hideNotify: hideNotify,
            });
        } finally {
            dispatch(UserActionCreators.setIsLoadingGetUser(false));
        }
    },

    clearUser: () => (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setUser({} as User));
        dispatch(UserActionCreators.setAuth(false));
    },

    updateCredentials: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        const {user} = getState().user;
        try {
            const res = await UserService.updateCurrentUserCredentials({
                firstName: user.firstName,
                lastName: user.lastName,
            });
            if (res.data.success) {

            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    hideNotify: true,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                hideNotify: true,
            });
        } finally {
            dispatch(UserActionCreators.setIsLoadingGetUser(false));
        }
    },

    updateEmail: () => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        const {user} = getState().user;
        try {
            const res = await UserService.updateCurrentUserEmail({
                email: user.email,
            });
            if (res.data.success) {

            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    hideNotify: true,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                hideNotify: true,
            });
        } finally {
            dispatch(UserActionCreators.setIsLoadingGetUser(false));
        }
    },

    updatePreferredLang: (lang: Langs) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            const res = await UserService.updateCurrentUserPreferredLang({
                preferredLang: lang,
            });
            if (res.data.success) {

            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    hideNotify: true,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                hideNotify: true,
            });
        } finally {
            dispatch(UserActionCreators.setIsLoadingGetUser(false));
        }
    },

    updatePassword: (password: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            const res = await UserService.updateCurrentUserPassword({
                password: password,
            });
            if (res.data.success) {

            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                    hideNotify: true,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                hideNotify: true,
            });
        } finally {
            dispatch(UserActionCreators.setIsLoadingGetUser(false));
        }
    }
}
