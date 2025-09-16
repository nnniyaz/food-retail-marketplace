import {AxiosResponse} from "axios";
import {OrderSettings} from "@entities/orderSettings/orderSettings";
import {$api} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

export class OrderSettingsService {
    static async getOrderSettings(controller: AbortController): Promise<AxiosResponse<SuccessResponse<OrderSettings> | ErrorResponse>> {
        return $api.get<SuccessResponse<OrderSettings> | ErrorResponse>(ApiRoutes.GET_ORDER_SETTINGS, {signal: controller.signal});
    }

    static async updateOrderSettingsMoqFee(request: {fee: number, freeFrom: number}): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_ORDER_SETTINGS_MOQ_FEE, {...request});
    }
}
