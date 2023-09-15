import {AxiosResponse} from "axios";
import {Paginate} from "entities/base/paginate";
import {UsersData, UserType} from "entities/user/user";
import $api from "shared/api";
import {ApiRoutes} from "shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "shared/api/response/response";

export interface AddUserReq {
    firstName: string;
    lastName: string;
    email: string;
    password: string
    userType: UserType;
}

export default class UsersService {
    static async getUsers(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<UsersData> | ErrorResponse>> {
        return $api.get<SuccessResponse<UsersData> | ErrorResponse>(ApiRoutes.GET_USERS, {params: {...request}, signal: controller.signal});
    }

    static async addUser(request: AddUserReq): Promise<AxiosResponse<SuccessResponse<UsersData> | ErrorResponse>> {
        return $api.post<SuccessResponse<UsersData> | ErrorResponse>(ApiRoutes.POST_USER, {...request});
    }
}
