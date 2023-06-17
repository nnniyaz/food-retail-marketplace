import {User, UsersGetRequest} from "entities/user/user";
import {FailedResponseHandler, httpHandler} from "shared/lib/http-handler/httpHandler";
import {AppDispatch, RootState} from "app/store";
import UsersService from "pages/staff/Users/api/usersService";
import {
    SetUsersAction,
    SetUsersCountAction,
    SetIsLoadingGetUsersAction,
    UsersActionEnum
} from "./types";

export const UsersActionCreators = {
    setUsers: (payload: User[]): SetUsersAction => ({type: UsersActionEnum.SET_USERS, payload}),
    setUsersCount: (payload: number): SetUsersCountAction => ({type: UsersActionEnum.SET_USERS_COUNT, payload}),
    setIsLoadingGetUsers: (payload: boolean): SetIsLoadingGetUsersAction => ({
        type: UsersActionEnum.SET_IS_LOADING_GET_USERS,
        payload
    }),
    fetchUsers: (request: UsersGetRequest, controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(UsersActionCreators.setIsLoadingGetUsers(true));
            const res = await UsersService.getUsers(request, controller);
            if (res.data.success) {
                dispatch(UsersActionCreators.setUsers(res.data.data.users));
                dispatch(UsersActionCreators.setUsersCount(res.data.data.usersCount));
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
            });
        } finally {
            dispatch(UsersActionCreators.setIsLoadingGetUsers(false));
        }
    }
}
