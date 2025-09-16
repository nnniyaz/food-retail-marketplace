import {AppDispatch, RootState} from "@app/store";
import UsersService, {
    AddUserDeliveryPointReq,
    AddUserReq,
    DeleteUserDeliveryPointReq,
    EditUserCredentialsReq,
    EditUserDeliveryPointReq,
    EditUserEmailReq,
    EditUserLastDeliveryPointReq,
    EditUserPasswordReq, EditUserPhoneReq,
    EditUserPreferredLangReq,
    EditUserRoleReq
} from "@pages/staff/Users/api/usersService";
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
    SetIsLoadingEditUserCredentialsAction,
    SetIsLoadingEditUserEmailAction,
    SetIsLoadingEditUserPhoneAction,
    SetIsLoadingEditUserPreferredLangAction,
    SetIsLoadingEditUserRoleAction,
    SetIsLoadingAddUserDeliveryPointAction,
    SetIsLoadingEditUserDeliveryPointAction,
    SetIsLoadingDeleteUserDeliveryPointAction,
    SetIsLoadingEditUserLastDeliveryPointAction,
    SetIsLoadingEditUserPasswordAction,
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
    setIsLoadingEditUsersCredentials: (payload: boolean): SetIsLoadingEditUserCredentialsAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_CREDENTIALS,
        payload
    }),
    setIsLoadingEditUsersEmail: (payload: boolean): SetIsLoadingEditUserEmailAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_EMAIL,
        payload
    }),
    setIsLoadingEditUsersPhone: (payload: boolean): SetIsLoadingEditUserPhoneAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_PHONE,
        payload
    }),
    setIsLoadingEditUsersPreferredLang: (payload: boolean): SetIsLoadingEditUserPreferredLangAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_PREFERRED_LANG,
        payload
    }),
    setIsLoadingEditUsersRole: (payload: boolean): SetIsLoadingEditUserRoleAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_ROLE,
        payload
    }),
    setIsLoadingAddUsersDeliveryPoint: (payload: boolean): SetIsLoadingAddUserDeliveryPointAction => ({
        type: UsersActionEnum.SET_IS_LOADING_ADD_USER_DELIVERY_POINT,
        payload
    }),
    setIsLoadingEditUsersDeliveryPoint: (payload: boolean): SetIsLoadingEditUserDeliveryPointAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_DELIVERY_POINT,
        payload
    }),
    setIsLoadingDeleteUsersDeliveryPoint: (payload: boolean): SetIsLoadingDeleteUserDeliveryPointAction => ({
        type: UsersActionEnum.SET_IS_LOADING_DELETE_USER_DELIVERY_POINT,
        payload
    }),
    setIsLoadingEditUsersLastDeliveryPoint: (payload: boolean): SetIsLoadingEditUserLastDeliveryPointAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_LAST_DELIVERY_POINT,
        payload
    }),
    setIsLoadingEditUsersPassword: (payload: boolean): SetIsLoadingEditUserPasswordAction => ({
        type: UsersActionEnum.SET_IS_LOADING_EDIT_USER_PASSWORD,
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

    getUserById: (userId: UUID, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
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

    editUserCredentials: (userId: UUID, request: EditUserCredentialsReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersCredentials(true));
            const res = await UsersService.editUserCredentials(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_credentials_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersCredentials(false));
        }
    },

    editUserEmail: (userId: UUID, request: EditUserEmailReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersEmail(true));
            const res = await UsersService.editUserEmail(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_email_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersEmail(false));
        }
    },

    editUserPhone: (userId: UUID, request: EditUserPhoneReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersPhone(true));
            const res = await UsersService.editUserPhone(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_phone_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersPhone(false));
        }
    },

    editUserPreferredLang: (userId: UUID, request: EditUserPreferredLangReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersPreferredLang(true));
            const res = await UsersService.editUserPreferredLang(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_preferred_lang_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersPreferredLang(false));
        }
    },

    editUserRole: (userId: UUID, request: EditUserRoleReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersRole(true));
            const res = await UsersService.editUserRole(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_role_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersRole(false));
        }
    },

    addUserDeliveryPoint: (userId: UUID, request: AddUserDeliveryPointReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingAddUsersDeliveryPoint(true));
            const res = await UsersService.addUserDeliveryPoint(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_delivery_point_successfully_added[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingAddUsersDeliveryPoint(false));
        }
    },

    editUserDeliveryPoint: (userId: UUID, request: EditUserDeliveryPointReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersDeliveryPoint(true));
            const res = await UsersService.editUserDeliveryPoint(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_delivery_point_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersDeliveryPoint(false));
        }
    },

    deleteUserDeliveryPoint: (userId: UUID, request: DeleteUserDeliveryPointReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingDeleteUsersDeliveryPoint(true));
            const res = await UsersService.deleteUserDeliveryPoint(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_delivery_point_successfully_deleted[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingDeleteUsersDeliveryPoint(false));
        }
    },

    editUserLastDeliveryPoint: (userId: UUID, request: EditUserLastDeliveryPointReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersLastDeliveryPoint(true));
            const res = await UsersService.editUserLastDeliveryPoint(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_last_delivery_point_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersLastDeliveryPoint(false));
        }
    },

    editUserPassword: (userId: UUID, request: EditUserPasswordReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingEditUsersPassword(true));
            const res = await UsersService.editUserPassword(userId, request);
            if (res.data.success) {
                await UsersActionCreators.getUserById(userId, new AbortController(), navigationCallback)(dispatch, getState);
                Notify.Success({title: txt.user_password_successfully_edited[currentLang], message: ""});
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
            dispatch(UsersActionCreators.setIsLoadingEditUsersPassword(false));
        }
    },

    recoverUser: (userId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
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
    },

    deleteUser: (userId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
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
}
