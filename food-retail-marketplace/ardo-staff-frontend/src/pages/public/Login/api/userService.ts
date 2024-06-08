import {AxiosResponse} from "axios";
import {User} from "@entities/user/user";
import {
    EditUserCredentialsReq,
    EditUserEmailReq,
    EditUserPreferredLangReq,
    EditUserPasswordReq
} from "@pages/staff/Users/api/usersService";
import {$api} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

export default class UserService {
    static getCurrentUser(): Promise<AxiosResponse<SuccessResponse<User> | ErrorResponse>> {
        return $api.get<SuccessResponse<User> | ErrorResponse>(ApiRoutes.GET_ME);
    }

    static updateCurrentUserCredentials(request: EditUserCredentialsReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_CREDENTIALS, {
            firstName: request.firstName.trim(),
            lastName: request.lastName.trim(),
        });
    }

    static updateCurrentUserEmail(request: EditUserEmailReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_ME_EMAIL, request);
    }

    static updateCurrentUserPreferredLang(request: EditUserPreferredLangReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_ME_PREFERRED_LANG, request);
    }

    static updateCurrentUserPassword(request: EditUserPasswordReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_ME_PASSWORD, request);
    }
}
