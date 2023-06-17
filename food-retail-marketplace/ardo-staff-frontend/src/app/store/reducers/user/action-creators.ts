import {User} from "entities/user/user";
import {NavigateCallback} from "entities/base/navigateCallback";
import {txt} from "shared/core/i18ngen";
import {Notify} from "shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "shared/lib/http-handler/httpHandler";
import UserService from "pages/public/Login/api/userService";
import {AuthActionCreators} from "pages/public/Login/store/auth/action-creators";
import {AppDispatch, RootState} from "../../index";
import {SetUserAction, SetIsLoadingGetUserAction, UserActionEnum} from "./types";

export const UserActionCreators = {
    setUser: (payload: User): SetUserAction => ({type: UserActionEnum.SET_USER, payload}),
    setIsLoadingGetUser: (payload: boolean): SetIsLoadingGetUserAction => ({
        type: UserActionEnum.SET_IS_LOADING_GET_USER,
        payload
    }),
    getCurrentUser: (navigateCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UserActionCreators.setIsLoadingGetUser(true));
            const res = await UserService.getCurrentUser();
            if (res.data.success) {
                if (res.data.data.userType !== "STAFF") {
                    const mainClientUri = process.env.REACT_APP_MAIN_CLIENT_URI;
                    if (mainClientUri) {
                        window.location.href = mainClientUri;
                    }
                    Notify.Info({
                        title: txt.internal_system[currentLang],
                        message: txt.you_dont_have_access_to_the_system[currentLang],
                    })
                    return;
                }
                dispatch(UserActionCreators.setUser(res.data.data));
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
                navigateCallback: navigateCallback
            });
        } finally {
            dispatch(UserActionCreators.setIsLoadingGetUser(false));
        }
    },
}
