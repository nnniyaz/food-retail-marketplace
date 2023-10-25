import {AppDispatch, RootState} from "@app/store";
import UsersService, {AddUserReq, EditUserReq} from "@pages/staff/Users/api/usersService";
import {User} from "@entities/user/user";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {txt} from "@shared/core/i18ngen";
import {Notify} from "@shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    SetUsersAction,
    SetUsersCountAction,
    SetIsLoadingGetUsersAction,
    SetIsLoadingAddUserAction,
    SetIsLoadingGetUserByIdAction,
    SetIsLoadingEditUserAction,
    SetIsLoadingDeleteUserAction,
    SetIsLoadingRecoverUserAction,
    SetUserByIdAction,
    UsersActionEnum
} from "./types";

export const UsersActionCreators = {
    setUsers: (payload: User[]): SetUsersAction => ({type: UsersActionEnum.SET_USERS, payload}),
    setUserById: (payload: User): SetUserByIdAction => ({type: UsersActionEnum.SET_USER_BY_ID, payload}),
    setUsersCount: (payload: number): SetUsersCountAction => ({type: UsersActionEnum.SET_USERS_COUNT, payload}),
    setIsLoadingGetUsers: (payload: boolean): SetIsLoadingGetUsersAction => ({
        type: UsersActionEnum.SET_IS_LOADING_GET_USERS,
        payload
    }),
    setIsLoadingGetUserById: (payload: boolean): SetIsLoadingGetUserByIdAction => ({
        type: UsersActionEnum.SET_IS_LOADING_GET_USER_BY_ID,
        payload
    }),
    setIsLoadingAddUsers: (payload: boolean): SetIsLoadingAddUserAction => ({
        type: UsersActionEnum.SET_IS_LOADING_ADD_USER,
        payload
    }),
    setIsLoadingEditUsers: (payload: boolean): SetIsLoadingEditUserAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER,
        payload
    }),
    setIsLoadingDeleteUsers: (payload: boolean): SetIsLoadingDeleteUserAction => ({
        type: UsersActionEnum.SET_IS_LOADING_DELETE_USER,
        payload
    }),
    setIsLoadingRecoverUsers: (payload: boolean): SetIsLoadingRecoverUserAction => ({
        type: UsersActionEnum.SET_IS_LOADING_RECOVER_USER,
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

    getUserById: (userId: string, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingGetUserById(true));
            const res = await UsersService.getUserById(userId, controller);
            if (res.data.success) {
                dispatch(UsersActionCreators.setUserById(res.data.data || null));
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
            dispatch(UsersActionCreators.setIsLoadingGetUserById(false));
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
    },

    editUser: (userId: string, request: EditUserReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsers(true));
            const res = await UsersService.editUser(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsers(false));
        }
    },

    deleteUser: (userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingDeleteUsers(true));
            const res = await UsersService.deleteUser(userId);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_successfully_deleted[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingDeleteUsers(false));
        }
    },

    recoverUser: (userId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingRecoverUsers(true));
            const res = await UsersService.recoverUser(userId);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_successfully_recovered[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingRecoverUsers(false));
        }
    }
}
