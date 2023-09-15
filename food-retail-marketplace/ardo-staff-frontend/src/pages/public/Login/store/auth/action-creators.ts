import {AppDispatch, RootState} from "app/store";
import {UserActionCreators} from "app/store/reducers/user/action-creators";
import {RouteNames} from "pages";
import {NavigateCallback} from "entities/base/navigateCallback";
import {txt} from "shared/core/i18ngen";
import {Notify} from "shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler,} from "shared/lib/http-handler/httpHandler";
import AuthService, {LoginRequest} from "../../api/authService";
import {SetIsLoadingAuthAction, SetIsLoadingLogoutAction, AuthActionEnum} from "./types";

export const AuthActionCreators = {
    setIsLoadingAuth: (payload: boolean): SetIsLoadingAuthAction => ({
        type: AuthActionEnum.SET_IS_LOADING_AUTH,
        payload
    }),
    setIsLoadingLogout: (payload: boolean): SetIsLoadingLogoutAction => ({
        type: AuthActionEnum.SET_IS_LOADING_LOGOUT,
        payload
    }),
    login: (request: LoginRequest, navigateCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(AuthActionCreators.setIsLoadingAuth(true));
            const res = await AuthService.login(request);
            if (res.data.success) {
                await UserActionCreators.getCurrentUser(navigateCallback)(dispatch, getState);
                if (getState().user?.isAuth) {
                    Notify.Success({
                        title: txt.authorization[currentLang],
                        message: txt.welcome_to_the_system[currentLang]
                    });
                    navigateCallback?.navigate(RouteNames.DASHBOARD);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigateCallback
            });
        } finally {
            dispatch(AuthActionCreators.setIsLoadingAuth(false));
        }
    },
    logout: (navigateCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(AuthActionCreators.setIsLoadingLogout(true));
            const res = await AuthService.logout();
            if (res.data.success) {
                UserActionCreators.clearUser()(dispatch);
                if (!getState().user?.isAuth) {
                    Notify.Success({
                        title: txt.authorization[currentLang],
                        message: txt.you_have_successfully_logged_out[currentLang]
                    });
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigateCallback
            });
        } finally {
            dispatch(AuthActionCreators.setIsLoadingLogout(false));
        }
    }
}
