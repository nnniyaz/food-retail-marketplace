import {AxiosResponse} from "axios";
import {User} from "entities/user/user";
import $api from "shared/api";
import {ApiRoutes} from "shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "shared/api/response/response";

export default class UserService {
    static getCurrentUser(): Promise<AxiosResponse<SuccessResponse<User> | ErrorResponse>> {
        return $api.get<SuccessResponse<User> | ErrorResponse>(ApiRoutes.GET_ME);
    }
}
