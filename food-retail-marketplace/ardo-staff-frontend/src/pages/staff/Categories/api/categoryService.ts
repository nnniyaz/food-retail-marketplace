import { AxiosResponse } from "axios";
import {Paginate} from "@entities/base/paginate";
import {CategoriesData, Category} from "@entities/category/category";
import $api from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse } from "@shared/api/response/response";
import {MlString} from "@entities/base/MlString";

export interface AddCategoryReq {
    name: MlString;
    desc: MlString;
    img: string;
}

export interface EditCategoryReq {
    name: MlString;
    desc: MlString;
    img: string;
}

export class CategoryService {
    static async getCategories(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<CategoriesData> | ErrorResponse>> {
        return $api.get<SuccessResponse<CategoriesData> | ErrorResponse>(ApiRoutes.GET_CATEGORIES, {params: {...request}, signal: controller.signal});
    }

    static async getCategoryById(categoryId: string, controller: AbortController): Promise<AxiosResponse<SuccessResponse<Category> | ErrorResponse>> {
        return $api.get<SuccessResponse<Category> | ErrorResponse>(ApiRoutes.GET_CATEGORY.replace(":category_id", categoryId), {signal: controller.signal});
    }

    static async addCategory(request: AddCategoryReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_CATEGORY, {...request});
    }

    static async editCategory(categoryId: string, request: EditCategoryReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_CATEGORY.replace(":category_id", categoryId), {...request});
    }

    static async recoverCategory(categoryId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_CATEGORY_RECOVER.replace(":category_id", categoryId));
    }

    static async deleteCategory(categoryId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_CATEGORY.replace(":category_id", categoryId));
    }
}
