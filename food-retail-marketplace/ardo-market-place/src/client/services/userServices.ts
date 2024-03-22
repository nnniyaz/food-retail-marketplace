import {AxiosResponse} from "axios";
import {User} from "@domain/user/user.ts";
import $api from "@pkg/api";
import {ApiRoutes} from "@pkg/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";

export class UserService {
    static getCurrentUser(apiUri: string): Promise<AxiosResponse<SuccessResponse<User> | ErrorResponse>> {
        return $api(apiUri).get<SuccessResponse<User> | ErrorResponse>(ApiRoutes.GET_ME);
    }
}
