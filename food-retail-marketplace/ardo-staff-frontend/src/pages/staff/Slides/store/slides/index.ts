import {SlideAction, SlideActionEnum, SlideState} from "@pages/staff/Slides/store/slides/types";

const initialState: SlideState = {
    slides: [],
    slideById: null,
    slidesCount: 0,
    isLoadingGetSlides: false,
    isLoadingGetSlideById: false,
    isLoadingAddSlide: false,
    isLoadingEditSlide: false,
    isLoadingRecoverSlide: false,
    isLoadingDeleteSlide: false,
    isLoadingSlideImageUpload: false,
}

export default function slideReducer(state = initialState, action: SlideAction): SlideState {
    switch (action.type) {
        case SlideActionEnum.SET_SLIDES:
            return {...state, slides: action.payload};
        case SlideActionEnum.SET_SLIDE_BY_ID:
            return {...state, slideById: action.payload};
        case SlideActionEnum.SET_SLIDES_COUNT:
            return {...state, slidesCount: action.payload};
        case SlideActionEnum.SET_IS_LOADING_GET_SLIDES:
            return {...state, isLoadingGetSlides: action.payload};
        case SlideActionEnum.SET_IS_LOADING_GET_SLIDE_BY_ID:
            return {...state, isLoadingGetSlideById: action.payload};
        case SlideActionEnum.SET_IS_LOADING_ADD_SLIDE:
            return {...state, isLoadingAddSlide: action.payload};
        case SlideActionEnum.SET_IS_LOADING_EDIT_SLIDE:
            return {...state, isLoadingEditSlide: action.payload};
        case SlideActionEnum.SET_IS_LOADING_RECOVER_SLIDE:
            return {...state, isLoadingRecoverSlide: action.payload};
        case SlideActionEnum.SET_IS_LOADING_DELETE_SLIDE:
            return {...state, isLoadingDeleteSlide: action.payload};
        case SlideActionEnum.SET_IS_LOADING_SLIDE_IMAGE_UPLOAD:
            return {...state, isLoadingSlideImageUpload: action.payload};
        default:
            return state;
    }
}
