import axios, {AxiosResponse} from "axios";
import {UsersData, UsersGetRequest} from "entities/user/user";
import $api from "shared/api";
import {ApiRoutes} from "shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "shared/api/response/response";

export default class UsersService {
    static async getUsers(request: UsersGetRequest, controller: AbortController): Promise<AxiosResponse<SuccessResponse<UsersData> | ErrorResponse>> {
        return $api.get<SuccessResponse<UsersData> | ErrorResponse>(ApiRoutes.GET_USERS, {params: {...request}, signal: controller.signal});
    }
}
