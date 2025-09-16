import {AxiosResponse} from "axios";
import {Phone} from "@entities/base/phone";
import {Langs} from "@entities/base/MlString";
import {Paginate} from "@entities/base/paginate";
import {User, UsersData, UserType} from "@entities/user/user";
import {$api} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

export interface AddUserReq {
    firstName: string;
    lastName: string;
    email: string;
    phone: Phone;
    password: string
    userType: UserType;
    preferredLang: Langs;
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

export interface EditUserCredentialsReq {
    firstName: string;
    lastName: string;
}

export interface EditUserEmailReq {
    email: string;
}

export interface EditUserPhoneReq {
    phoneNumber: string;
    countryCode: string;
}

export interface EditUserPreferredLangReq {
    preferredLang: Langs;
}

export interface EditUserRoleReq {
    role: UserType;
}

export interface AddUserDeliveryPointReq {
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

export interface EditUserDeliveryPointReq {
    id: string;
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

export interface DeleteUserDeliveryPointReq {
    deliveryPointId: string;
}

export interface EditUserLastDeliveryPointReq {
    deliveryPointId: string;
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

    static async editUserPhone(userId: string, request: EditUserPhoneReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_PHONE.replace(":user_id", userId), {...request});
    }

    static async editUserPreferredLang(userId: string, request: EditUserPreferredLangReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_PREFERRED_LANG.replace(":user_id", userId), {...request});
    }

    static async editUserRole(userId: string, request: EditUserRoleReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_ROLE.replace(":user_id", userId), {...request});
    }

    static async addUserDeliveryPoint(userId: string, request: AddUserDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_USER_DELIVERY_POINT.replace(":user_id", userId), {...request});
    }

    static async editUserDeliveryPoint(userId: string, request: EditUserDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_DELIVERY_POINT.replace(":user_id", userId), {...request});
    }

    static async deleteUserDeliveryPoint(userId: string, request: DeleteUserDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_USER_DELIVERY_POINT.replace(":user_id", userId), {...request});
    }

    static async editUserLastDeliveryPoint(userId: string, request: EditUserLastDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_USER_LAST_DELIVERY_POINT.replace(":user_id", userId), {...request});
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
