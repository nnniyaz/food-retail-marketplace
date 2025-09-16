import {AxiosResponse} from "axios";
import $api, {ApiCfg} from "@pkg/api";
import {Phone} from "@domain/base/phone/phone.ts";
import {ApiRoutes} from "@pkg/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";
import {Langs} from "@domain/base/mlString/mlString.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string,
    lastName: string,
    phone: Phone,
    email: string,
    password: string,
    address: string,
    floor: string,
    apartment: string,
    deliveryInstruction: string,
    preferredLang: Langs,
}

export default class AuthService {
    static async login (cfg: ApiCfg, request: LoginRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_LOGIN, request)
    }

    static async logout (cfg: ApiCfg,): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_LOGOUT)
    }

    static async register (cfg: ApiCfg, request: RegisterRequest): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_REGISTER, request)
    }
}
