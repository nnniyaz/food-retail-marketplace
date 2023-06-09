import {AppDispatch, RootState} from "app/store";
import {SetAuthAction, SetLoadingAuthAction, AuthActionEnum} from "./types";
import AuthService, {LoginRequest} from "../../api/authService";
import {NavigateCallback} from "entities/base/navigateCallback";
import {txt} from "shared/core/i18ngen";
import {Notify} from "shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler,} from "shared/lib/http-handler/httpHandler";

export const AuthActionCreators = {
    setAuth: (payload: boolean): SetAuthAction => ({type: AuthActionEnum.SET_AUTH, payload}),
    setLoadingAuth: (payload: boolean): SetLoadingAuthAction => ({type: AuthActionEnum.SET_LOADING_AUTH, payload}),

    login: (request: LoginRequest, navigateCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(AuthActionCreators.setLoadingAuth(true));
            const res = await AuthService.login(request);

            if (res.data.success) {
                dispatch(AuthActionCreators.setAuth(true));
                Notify.Success({
                    title: txt.authorization[currentLang],
                    message: txt.welcome_to_the_system[currentLang]
                });
            } else {
                FailedResponseHandler({
                    message: res.data?.message,
                    httpStatus: res.status,
                    currentLang: currentLang,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigateCallback,
            });
        } finally {
            dispatch(AuthActionCreators.setLoadingAuth(false));
        }
    }
}
