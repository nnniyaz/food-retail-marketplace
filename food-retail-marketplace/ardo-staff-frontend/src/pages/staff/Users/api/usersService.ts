import axios, {AxiosResponse} from "axios";
import {UsersData, UsersGetRequest} from "entities/user/user";
import {ApiRoutes} from "shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "shared/api/response/response";

export default class UsersService {
    static async getUsers(request: UsersGetRequest): Promise<AxiosResponse<SuccessResponse<UsersData> | ErrorResponse>> {
        return axios.get<SuccessResponse<UsersData> | ErrorResponse>(ApiRoutes.USERS, {params: {...request}});
    }
}
