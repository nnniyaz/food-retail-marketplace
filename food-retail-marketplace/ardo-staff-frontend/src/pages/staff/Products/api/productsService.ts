import {AxiosResponse} from "axios";
import {Paginate} from "@entities/base/paginate";
import {MlString} from "@entities/base/MlString";
import {Product, ProductsData, ProductStatus} from "@entities/product/product";
import {$api, $apiFormData} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";
import {ImageUploadResponse} from "@entities/base/imageUploadResponse";

export interface AddProductReq {
    name: MlString;
    desc: MlString;
    price: number;
    originalPrice: number;
    quantity: number;
    tags: string[];
    img: string;
    status: ProductStatus;
}

export interface EditProductCredentialsReq {
    name: MlString;
    desc: MlString;
    price: number;
    originalPrice: number;
    quantity: number;
    tags: string[];
    img: string;
    status: ProductStatus;
}

export class ProductsService {
    static async getProducts(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<ProductsData> | ErrorResponse>> {
        return $api.get<SuccessResponse<ProductsData> | ErrorResponse>(ApiRoutes.GET_PRODUCTS, {params: {...request}, signal: controller.signal});
    }

    static async getProductById(productId: string, controller: AbortController): Promise<AxiosResponse<SuccessResponse<Product> | ErrorResponse>> {
        return $api.get<SuccessResponse<Product> | ErrorResponse>(ApiRoutes.GET_PRODUCT.replace(":product_id", productId), {signal: controller.signal});
    }

    static async addProduct(request: AddProductReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_PRODUCT, {...request});
    }

    static async editProductCredentials(productId: string, request: EditProductCredentialsReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_PRODUCT_CREDENTIALS.replace(":product_id", productId), {...request});
    }

    static async recoverProduct(productId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_PRODUCT_RECOVER.replace(":product_id", productId));
    }

    static async deleteProduct(productId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_PRODUCT.replace(":product_id", productId));
    }

    static async uploadProductImage(formData: FormData): Promise<AxiosResponse<SuccessResponse<ImageUploadResponse> | ErrorResponse>> {
        return $apiFormData.post<SuccessResponse<ImageUploadResponse> | ErrorResponse>(ApiRoutes.POST_UPLOAD_PRODUCT_IMAGE, formData);
    }
}
