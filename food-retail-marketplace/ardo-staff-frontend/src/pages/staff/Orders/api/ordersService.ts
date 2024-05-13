import {AxiosResponse} from "axios";
import {Paginate} from "@entities/base/paginate";
import {CustomerContacts, DeliveryInfo, OrderProduct, OrdersData, OrderStatus} from "@entities/order/order";
import {$api} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

export interface AddOrderReq {
    userId: UUID;
    products: OrderProduct[];
    quantity: number;
    totalPrice: number;
    customerContacts: CustomerContacts;
    deliveryInfo: DeliveryInfo;
    orderComment: string;
}

export interface EditOrderStatusReq {
    status: OrderStatus;
}

export class OrdersService {
    static async getOrders(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<OrdersData> | ErrorResponse>> {
        return $api.get<SuccessResponse<OrdersData> | ErrorResponse>(ApiRoutes.GET_ORDERS, {
            params: {...request},
            signal: controller.signal
        });
    }

    static async getOrderByUserId(userId: string, controller: AbortController): Promise<AxiosResponse<SuccessResponse<OrdersData> | ErrorResponse>> {
        return $api.get<SuccessResponse<OrdersData> | ErrorResponse>(ApiRoutes.GET_ORDERS_BY_USER_ID.replace(":user_id", userId), {signal: controller.signal});
    }

    static async getOrderById(orderId: string, controller: AbortController): Promise<AxiosResponse<SuccessResponse<OrdersData> | ErrorResponse>> {
        return $api.get<SuccessResponse<OrdersData> | ErrorResponse>(ApiRoutes.GET_ORDER.replace(":order_id", orderId), {signal: controller.signal});
    }

    static async addOrder(request: AddOrderReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_ORDER, {...request});
    }

    static async updateOrderStatus(orderId: string, request: EditOrderStatusReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_ORDER_STATUS.replace(":order_id", orderId), {...request});
    }

    static async recoverProduct(orderId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_ORDER_RECOVER.replace(":order_id", orderId));
    }

    static async deleteProduct(orderId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_ORDER.replace(":order_id", orderId));
    }
}
