import {AxiosResponse} from "axios";
import $api from "@pkg/api";
import {ApiRoutes} from "@pkg/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@pkg/api/response/response.ts";
import {OrderRequest} from "@domain/order/orderRequest.ts";
import {OrderResponse} from "@domain/order/orderResponse.ts";

export class CartServices {
    static async makeOrder(request: OrderRequest): Promise<AxiosResponse<SuccessResponse<OrderResponse> | ErrorResponse>> {
        return $api.post<SuccessResponse<OrderResponse> | ErrorResponse>(ApiRoutes.POST_MAKE_ORDER, request);
    }
}
