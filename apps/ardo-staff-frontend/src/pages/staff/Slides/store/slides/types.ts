import {Slide} from "@entities/slide/slide";

export interface SlideState {
    slides: Slide[];
    slideById: Slide | null;
    slidesCount: number;
    isLoadingGetSlides: boolean;
    isLoadingGetSlideById: boolean;
    isLoadingAddSlide: boolean;
    isLoadingEditSlide: boolean;
    isLoadingRecoverSlide: boolean;
    isLoadingDeleteSlide: boolean;
    isLoadingSlideImageUpload: boolean;
}

export enum SlideActionEnum {
    SET_SLIDES = "SET_SLIDES",
    SET_SLIDE_BY_ID = "SET_SLIDE_BY_ID",
    SET_SLIDES_COUNT = "SET_SLIDES_COUNT",
    SET_IS_LOADING_GET_SLIDES = "SET_IS_LOADING_GET_SLIDES",
    SET_IS_LOADING_GET_SLIDE_BY_ID = "SET_IS_LOADING_GET_SLIDE_BY_ID",
    SET_IS_LOADING_ADD_SLIDE = "SET_IS_LOADING_ADD_SLIDE",
    SET_IS_LOADING_EDIT_SLIDE = "SET_IS_LOADING_EDIT_SLIDE",
    SET_IS_LOADING_RECOVER_SLIDE = "SET_IS_LOADING_RECOVER_SLIDE",
    SET_IS_LOADING_DELETE_SLIDE = "SET_IS_LOADING_DELETE_SLIDE",
    SET_IS_LOADING_SLIDE_IMAGE_UPLOAD = "SET_IS_LOADING_SLIDE_IMAGE_UPLOAD",
}

export interface SetSlidesAction {
    type: SlideActionEnum.SET_SLIDES;
    payload: Slide[];
}

export interface SetSlideByIdAction {
    type: SlideActionEnum.SET_SLIDE_BY_ID;
    payload: Slide;
}

export interface SetSlidesCountAction {
    type: SlideActionEnum.SET_SLIDES_COUNT;
    payload: number;
}

export interface SetIsLoadingGetSlidesAction {
    type: SlideActionEnum.SET_IS_LOADING_GET_SLIDES;
    payload: boolean;
}

export interface SetIsLoadingGetSlideByIdAction {
    type: SlideActionEnum.SET_IS_LOADING_GET_SLIDE_BY_ID;
    payload: boolean;
}

export interface SetIsLoadingAddSlideAction {
    type: SlideActionEnum.SET_IS_LOADING_ADD_SLIDE;
    payload: boolean;
}

export interface SetIsLoadingEditSlideAction {
    type: SlideActionEnum.SET_IS_LOADING_EDIT_SLIDE;
    payload: boolean;
}

export interface SetIsLoadingRecoverSlideAction {
    type: SlideActionEnum.SET_IS_LOADING_RECOVER_SLIDE;
    payload: boolean;
}

export interface SetIsLoadingDeleteSlideAction {
    type: SlideActionEnum.SET_IS_LOADING_DELETE_SLIDE;
    payload: boolean;
}

export interface SetIsLoadingSlideImageUploadAction {
    type: SlideActionEnum.SET_IS_LOADING_SLIDE_IMAGE_UPLOAD;
    payload: boolean;
}

export type SlideAction =
    SetSlidesAction |
    SetSlideByIdAction |
    SetSlidesCountAction |
    SetIsLoadingGetSlidesAction |
    SetIsLoadingGetSlideByIdAction |
    SetIsLoadingAddSlideAction |
    SetIsLoadingEditSlideAction |
    SetIsLoadingRecoverSlideAction |
    SetIsLoadingDeleteSlideAction |
    SetIsLoadingSlideImageUploadAction;
