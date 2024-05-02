import $api, {ApiCfg} from "@pkg/api";
import {AxiosResponse} from "axios";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";
import {ApiRoutes} from "@pkg/api/api-routes";
import {OrderData} from "@domain/order/order.ts";

export class OrderService {
    static async getOrders(cfg: ApiCfg): Promise<AxiosResponse<SuccessResponse<OrderData> | ErrorResponse>> {
        return $api(cfg).get<SuccessResponse<OrderData> | ErrorResponse>(ApiRoutes.GET_ORDERS);
    }
}
