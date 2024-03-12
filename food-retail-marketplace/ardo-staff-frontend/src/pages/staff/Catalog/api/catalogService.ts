import {AxiosResponse} from "axios";
import {Paginate} from "@entities/base/paginate";
import {CatalogData, CatalogsStructure} from "@entities/catalog/catalog";
import $api from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

interface EditCatalogReq {
    structure: CatalogsStructure[],
    promo: CatalogsStructure[],
}

export class CatalogService {
    static async getCatalogs(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<CatalogData> | ErrorResponse>> {
        return $api.get<SuccessResponse<CatalogData> | ErrorResponse>(ApiRoutes.GET_CATALOGS, {params: {...request}, signal: controller.signal});
    }

    static async editCatalog(request: EditCatalogReq): Promise<AxiosResponse<SuccessResponse<CatalogData> | ErrorResponse>> {
        return $api.get<SuccessResponse<CatalogData> | ErrorResponse>(ApiRoutes.PUT_CATALOG, {params: {...request}});
    }

    static async publishCatalog(): Promise<AxiosResponse<SuccessResponse<CatalogData> | ErrorResponse>> {
        return $api.get<SuccessResponse<CatalogData> | ErrorResponse>(ApiRoutes.POST_PUBLISH_CATALOG);
    }
}
