import {AxiosResponse} from "axios";
import $api from "@pkg/api";
import {ApiRoutes} from "@pkg/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";
import {Langs} from "@domain/base/mlString/mlString.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    preferredLang: Langs;
}

export default class AuthService {
    static async login (request: LoginRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_LOGIN, request)
    }

    static async logout (): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_LOGOUT)
    }

    static async register (request: RegisterRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_REGISTER, request)
    }
}
