import {AppDispatch, RootState} from "app/store";
import UsersService, {AddUserReq} from "pages/staff/Users/api/usersService";
import {User} from "entities/user/user";
import {Paginate} from "entities/base/paginate";
import {NavigateCallback} from "entities/base/navigateCallback";
import {txt} from "shared/core/i18ngen";
import {Notify} from "shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "shared/lib/http-handler/httpHandler";
import {
    SetUsersAction,
    SetUsersCountAction,
    SetIsLoadingGetUsersAction,
    SetIsLoadingAddUsersAction,
    UsersActionEnum
} from "./types";

export const UsersActionCreators = {
    setUsers: (payload: User[]): SetUsersAction => ({type: UsersActionEnum.SET_USERS, payload}),
    setUsersCount: (payload: number): SetUsersCountAction => ({type: UsersActionEnum.SET_USERS_COUNT, payload}),
    setIsLoadingGetUsers: (payload: boolean): SetIsLoadingGetUsersAction => ({
        type: UsersActionEnum.SET_IS_LOADING_GET_USERS,
        payload
    }),
    setIsLoadingAddUsers: (payload: boolean): SetIsLoadingAddUsersAction => ({
        type: UsersActionEnum.SET_IS_LOADING_ADD_USERS,
        payload
    }),

    fetchUsers: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingGetUsers(true));
            const res = await UsersService.getUsers(request, controller);
            if (res.data.success) {
                dispatch(UsersActionCreators.setUsers(res.data.data.users));
                dispatch(UsersActionCreators.setUsersCount(res.data.data.count));
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(UsersActionCreators.setIsLoadingGetUsers(false));
        }
    },

    addUser: (request: AddUserReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingAddUsers(true));
            const res = await UsersService.addUser(request);
            if (res.data.success) {
                Notify.Success({title: txt.user_successfully_added[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(UsersActionCreators.setIsLoadingAddUsers(false));
        }
    }
}
