import {AxiosResponse} from "axios";
import {OrganizationsData, OrganizationsGetRequest} from "entities/organization/organization";
import $api from "shared/api";
import {ApiRoutes} from "shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "shared/api/response/response";

export default class OrganizationsService {
    static async getOrganizations(request: OrganizationsGetRequest, controller: AbortController): Promise<AxiosResponse<SuccessResponse<OrganizationsData> | ErrorResponse>> {
        return $api.get<SuccessResponse<OrganizationsData> | ErrorResponse>(ApiRoutes.GET_ORGANIZATIONS, {
            params: {...request},
            signal: controller.signal
        });
    }
}
