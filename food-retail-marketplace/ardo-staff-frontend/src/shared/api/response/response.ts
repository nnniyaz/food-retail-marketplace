import {MlString} from "../../../entities/base/MlString";

export interface ErrorResponse {
    success: false;
    message: MlString;
}

export interface SuccessResponse<T> {
    success: true;
    message: MlString;
    data: T;
}
