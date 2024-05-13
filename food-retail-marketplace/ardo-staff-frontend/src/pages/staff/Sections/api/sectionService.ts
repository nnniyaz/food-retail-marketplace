import { AxiosResponse } from "axios";
import {Paginate} from "@entities/base/paginate";
import {MlString} from "@entities/base/MlString";
import { SectionsData, Section } from "@entities/section/section";
import {$api} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse } from "@shared/api/response/response";

export interface AddSectionReq {
    name: MlString;
    img: string;
}

export interface EditSectionReq {
    name: MlString;
    img: string;
}

export class SectionService {
    static async getSections(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<SectionsData> | ErrorResponse>> {
        return $api.get<SuccessResponse<SectionsData> | ErrorResponse>(ApiRoutes.GET_SECTIONS, {params: {...request}, signal: controller.signal});
    }

    static async getSectionById(sectionId: string, controller: AbortController): Promise<AxiosResponse<SuccessResponse<Section> | ErrorResponse>> {
        return $api.get<SuccessResponse<Section> | ErrorResponse>(ApiRoutes.GET_SECTION.replace(":section_id", sectionId), {signal: controller.signal});
    }

    static async addSection(request: AddSectionReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_SECTION, {...request});
    }

    static async editSection(sectionId: string, request: EditSectionReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_SECTION.replace(":section_id", sectionId), {...request});
    }

    static async recoverSection(sectionId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_SECTION_RECOVER.replace(":section_id", sectionId));
    }

    static async deleteSection(sectionId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_SECTION.replace(":section_id", sectionId));
    }
}
