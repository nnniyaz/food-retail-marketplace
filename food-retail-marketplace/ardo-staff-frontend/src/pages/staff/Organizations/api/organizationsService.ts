import {AxiosResponse} from "axios";
import {MlString} from "@entities/base/MlString";
import {Paginate} from "@entities/base/paginate";
import {OrganizationsData} from "@entities/organization/organization";
import $api from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";

export interface AddOrganizationReq {
    logo: string;
    name: string;
    currency: string;
    phone: string;
    email: string;
    address: string;
    desc: MlString;
}

export default class OrganizationsService {
    static async getOrganizations(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<OrganizationsData> | ErrorResponse>> {
        return $api.get<SuccessResponse<OrganizationsData> | ErrorResponse>(ApiRoutes.GET_ORGANIZATIONS, {
            params: {...request},
            signal: controller.signal
        });
    }

    static async addOrganization(request: AddOrganizationReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_ORGANIZATION, request);
    }
}
