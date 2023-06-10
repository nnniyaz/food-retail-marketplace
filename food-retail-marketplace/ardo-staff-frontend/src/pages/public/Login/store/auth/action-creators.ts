import {AppDispatch, RootState} from "app/store";
import {UserActionCreators} from "app/store/reducers/user/action-creators";
import {NavigateCallback} from "entities/base/navigateCallback";
import {FailedResponseHandler, httpHandler,} from "shared/lib/http-handler/httpHandler";
import AuthService, {LoginRequest} from "../../api/authService";
import {SetAuthAction, SetIsLoadingAuthAction, AuthActionEnum} from "./types";

export const AuthActionCreators = {
    setAuth: (payload: boolean): SetAuthAction => ({type: AuthActionEnum.SET_AUTH, payload}),
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
