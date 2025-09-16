import {AppDispatch, RootState} from "@app/store";
import {AddSlideReq, EditSlideReq, SlidesService} from "@pages/staff/Slides/api/slidesService";
import {Slide} from "@entities/slide/slide";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {txt} from "@shared/core/i18ngen";
import {Notify} from "@shared/lib/notification/notification";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    SlideActionEnum,
    SetSlidesAction,
    SetSlideByIdAction,
    SetSlidesCountAction,
    SetIsLoadingGetSlidesAction,
    SetIsLoadingGetSlideByIdAction,
    SetIsLoadingAddSlideAction,
    SetIsLoadingEditSlideAction,
    SetIsLoadingRecoverSlideAction,
    SetIsLoadingDeleteSlideAction,
    SetIsLoadingSlideImageUploadAction,
} from "./types";

export const SlideActionCreators = {
    setSlides: (payload: Slide[]): SetSlidesAction => ({
        type: SlideActionEnum.SET_SLIDES,
        payload
    }),
    setSlideById: (payload: Slide): SetSlideByIdAction => ({
        type: SlideActionEnum.SET_SLIDE_BY_ID,
        payload
    }),
    setSlidesCount: (payload: number): SetSlidesCountAction => ({
        type: SlideActionEnum.SET_SLIDES_COUNT,
        payload
    }),
    setIsLoadingGetSlides: (payload: boolean): SetIsLoadingGetSlidesAction => ({
        type: SlideActionEnum.SET_IS_LOADING_GET_SLIDES,
        payload
    }),
    setIsLoadingGetSlideById: (payload: boolean): SetIsLoadingGetSlideByIdAction => ({
        type: SlideActionEnum.SET_IS_LOADING_GET_SLIDE_BY_ID,
        payload
    }),
    setIsLoadingAddSlide: (payload: boolean): SetIsLoadingAddSlideAction => ({
        type: SlideActionEnum.SET_IS_LOADING_ADD_SLIDE,
        payload
    }),
    setIsLoadingEditSlide: (payload: boolean): SetIsLoadingEditSlideAction => ({
        type: SlideActionEnum.SET_IS_LOADING_EDIT_SLIDE,
        payload
    }),
    setIsLoadingRecoverSlide: (payload: boolean): SetIsLoadingRecoverSlideAction => ({
        type: SlideActionEnum.SET_IS_LOADING_RECOVER_SLIDE,
        payload
    }),
    setIsLoadingDeleteSlide: (payload: boolean): SetIsLoadingDeleteSlideAction => ({
        type: SlideActionEnum.SET_IS_LOADING_DELETE_SLIDE,
        payload
    }),
    setIsLoadingSlideImageUpload: (payload: boolean): SetIsLoadingSlideImageUploadAction => ({
        type: SlideActionEnum.SET_IS_LOADING_SLIDE_IMAGE_UPLOAD,
        payload
    }),

    fetchSlides: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingGetSlides(true));
            const res = await SlidesService.getSlides(request, controller);
            if (res.data.success) {
                dispatch(SlideActionCreators.setSlides(res.data.data.slides));
                dispatch(SlideActionCreators.setSlidesCount(res.data.data.count));
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingGetSlides(false));
        }
    },

    getSlideById: (id: UUID, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingGetSlideById(true));
            const res = await SlidesService.getSlideById(id, controller);
            if (res.data.success) {
                dispatch(SlideActionCreators.setSlideById(res.data.data));
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingGetSlideById(false));
        }
    },

    addSlide: (request: AddSlideReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingAddSlide(true));
            const res = await SlidesService.addSlide(request);
            if (res.data.success) {
                Notify.Success({title: txt.slide_successfully_added[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingAddSlide(false));
        }
    },

    editSlide: (slideId: UUID, request: EditSlideReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingEditSlide(true));
            const res = await SlidesService.editSlide(request, slideId);
            if (res.data.success) {
                Notify.Success({title: txt.slide_successfully_edited[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingEditSlide(false));
        }
    },

    recoverSlide: (slideId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingRecoverSlide(true));
            const res = await SlidesService.recoverSlide(slideId);
            if (res.data.success) {
                Notify.Success({title: txt.slide_successfully_recovered[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingRecoverSlide(false));
        }
    },

    deleteSlide: (slideId: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingDeleteSlide(true));
            const res = await SlidesService.deleteSlide(slideId);
            if (res.data.success) {
                Notify.Success({title: txt.slide_successfully_deleted[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingDeleteSlide(false));
        }
    },

    uploadSlideImage: (request: FormData) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SlideActionCreators.setIsLoadingSlideImageUpload(true));
            const res = await SlidesService.uploadSlideImage(request);
            if (res.data.success) {
                Notify.Success({title: txt.slide_image_successfully_uploaded[currentLang], message: ""});
                return res.data.data?.filename;
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
            });
        } finally {
            dispatch(SlideActionCreators.setIsLoadingSlideImageUpload(false));
        }
    },
}
