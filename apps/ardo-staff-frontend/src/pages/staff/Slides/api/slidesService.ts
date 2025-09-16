import {AxiosResponse} from "axios";
import {MlString} from "@entities/base/MlString";
import {Slide, SlidesData} from "@entities/slide/slide";
import {$api, $apiFormData} from "@shared/api";
import {ApiRoutes} from "@shared/api/api-routes";
import {ErrorResponse, SuccessResponse} from "@shared/api/response/response";
import {Paginate} from "@entities/base/paginate";
import {ImageUploadResponse} from "@entities/base/imageUploadResponse";

export interface AddSlideReq {
    img: string;
    caption: MlString;
}

export interface EditSlideReq {
    img: string;
    caption: MlString;
}

export class SlidesService {
    static async getSlides(request: Paginate, controller: AbortController): Promise<AxiosResponse<SuccessResponse<SlidesData> | ErrorResponse>> {
        return $api.get<SuccessResponse<SlidesData> | ErrorResponse>(ApiRoutes.GET_SLIDES, {params: {...request}, signal: controller.signal});
    }

    static async getSlideById(slideId: UUID, controller: AbortController): Promise<AxiosResponse<SuccessResponse<Slide> | ErrorResponse>> {
        return $api.get<SuccessResponse<Slide> | ErrorResponse>(ApiRoutes.GET_SLIDE.replace(":slide_id", slideId), {signal: controller.signal});
    }

    static async addSlide(request: AddSlideReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post<SuccessResponse<null> | ErrorResponse>(ApiRoutes.POST_SLIDE, {...request});
    }

    static async editSlide(request: EditSlideReq, slideId: UUID): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_SLIDE.replace(":slide_id", slideId), {...request});
    }

    static async recoverSlide(slideId: UUID): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put<SuccessResponse<null> | ErrorResponse>(ApiRoutes.PUT_SLIDE_RECOVER.replace(":slide_id", slideId));
    }

    static async deleteSlide(slideId: UUID): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete<SuccessResponse<null> | ErrorResponse>(ApiRoutes.DELETE_SLIDE.replace(":slide_id", slideId));
    }

    static async uploadSlideImage(request: FormData): Promise<AxiosResponse<SuccessResponse<ImageUploadResponse> | ErrorResponse>> {
        return $apiFormData.post<SuccessResponse<ImageUploadResponse> | ErrorResponse>(ApiRoutes.POST_UPLOAD_SLIDE_IMAGE, request);
    }
}
