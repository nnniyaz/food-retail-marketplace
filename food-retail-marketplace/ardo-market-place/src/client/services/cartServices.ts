import {AxiosResponse} from "axios";
import $api, {ApiCfg} from "@pkg/api";
import {ApiRoutes} from "@pkg/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";
import {OrderRequest} from "@domain/order/orderRequest.ts";
import {OrderResponse} from "@domain/order/orderResponse.ts";

export class CartServices {
    static async makeOrder(cfg: ApiCfg, request: OrderRequest): Promise<AxiosResponse<SuccessResponse<OrderResponse> | ErrorResponse>> {
        return $api(cfg).post<SuccessResponse<OrderResponse> | ErrorResponse>(ApiRoutes.POST_MAKE_ORDER, request);
    }
}
