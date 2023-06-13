import {AxiosResponse} from "axios";
import $api from "shared/api";
import {ApiRoutes} from "shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "shared/api/response/response";

export interface LoginRequest {
    email: string;
    password: string;
}

export default class AuthService {
    static async login (request: LoginRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.LOGIN, request)
    }
}
