import {AppDispatch, RootState} from "app/store";
import {UserActionCreators} from "app/store/reducers/user/action-creators";
import {NavigateCallback} from "entities/base/navigateCallback";
import {FailedResponseHandler, httpHandler,} from "shared/lib/http-handler/httpHandler";
import AuthService, {LoginRequest} from "../../api/authService";
import {SetIsLoadingAuthAction, AuthActionEnum} from "./types";
import {Notify} from "../../../../../shared/lib/notification/notification";
import {txt} from "../../../../../shared/core/i18ngen";

export const AuthActionCreators = {
    setIsLoadingAuth: (payload: boolean): SetIsLoadingAuthAction => ({
        type: AuthActionEnum.SET_IS_LOADING_AUTH,
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
                }
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
                navigateCallback: navigateCallback
            });
        } finally {
            dispatch(AuthActionCreators.setIsLoadingAuth(false));
        }
    }
}
