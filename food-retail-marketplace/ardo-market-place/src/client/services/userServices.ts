import {AxiosResponse} from "axios";
import {User} from "@domain/user/user.ts";
import $api, {ApiCfg} from "@pkg/api";
import {ApiRoutes} from "@pkg/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";

interface AddDeliveryPointReq {
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

interface UpdateDeliveryPointReq {
    id: string;
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

interface DeleteDeliveryPointReq {
    deliveryPointId: string;
}

interface ChangeLastDeliveryPointReq {
    deliveryPointId: string;
}

export class UserService {
    static getCurrentUser(cfg: ApiCfg): Promise<AxiosResponse<SuccessResponse<User> | ErrorResponse>> {
        return $api(cfg).get<SuccessResponse<User> | ErrorResponse>(ApiRoutes.GET_ME);
    }

    static addDeliveryPoint(cfg: ApiCfg, request: AddDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_DELIVERY_POINT, request);
    }

    static updateDeliveryPoint(cfg: ApiCfg, request: UpdateDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_DELIVERY_POINT, request);
    }

    static deleteDeliveryPoint(cfg: ApiCfg, request: DeleteDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_DELIVERY_POINT.replace(':delivery_point_id', request.deliveryPointId));
    }

    static changeLastDeliveryPoint(cfg: ApiCfg, request: ChangeLastDeliveryPointReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api(cfg).put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_LAST_DELIVERY_POINT, request);
    }
}
