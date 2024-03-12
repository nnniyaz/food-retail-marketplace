import {AxiosResponse} from "axios";
import {Langs} from "@entities/base/MlString";
import {Paginate} from "@entities/base/paginate";
import {User, UsersData, UserType} from "@entities/user/user";
import $api from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

export interface AddUserReq {
    firstName: string;
    lastName: string;
    email: string;
    password: string
    userType: UserType;
    preferredLang: Langs;
}

export interface EditUserCredentialsReq {
    firstName: string;
    lastName: string;
}

export interface EditUserEmailReq {
    email: string;
}

export interface EditUserPreferredLangReq {
    preferredLang: Langs;
}

export interface EditUserPasswordReq {
    password: string;
}

export default class UsersService {
    static async getUsers(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<UsersData> | ErrorResponse>> {
        return $api.get<SuccessResponse<UsersData> | ErrorResponse>(ApiRoutes.GET_USERS, {params: {...request}, signal: controller.signal});
    }

    static async getUserById(userId: string, controller: AbortController): Promise<AxiosResponse<SuccessResponse<User> | ErrorResponse>> {
        return $api.get<SuccessResponse<User> | ErrorResponse>(ApiRoutes.GET_USER.replace(":user_id", userId), {signal: controller.signal});
    }

    static async addUser(request: AddUserReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_USER, {...request});
    }

    static async editUserCredentials(userId: string, request: EditUserCredentialsReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_CREDENTIALS.replace(":user_id", userId), {...request});
    }

    static async editUserEmail(userId: string, request: EditUserEmailReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_EMAIL.replace(":user_id", userId), {...request});
    }

    static async editUserPreferredLang(userId: string, request: EditUserPreferredLangReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_PREFERRED_LANG.replace(":user_id", userId), {...request});
    }

    static async editUserPassword(userId: string, request: EditUserPasswordReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_PASSWORD.replace(":user_id", userId), {...request});
    }

    static async deleteUser(userId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_USER.replace(":user_id", userId));
    }

    static async recoverUser(userId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_RECOVER.replace(":user_id", userId));
    }
}
